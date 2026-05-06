from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from django.db import transaction
from django.db.models import Prefetch

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer, CartItemUpdateSerializer
from product.models import Product, ProductVariant


class CartViewSet(viewsets.GenericViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_cart_queryset(self):
        
        items_qs = CartItem.objects.select_related(
            'product__category',
            'variant__size'
        ).prefetch_related(
            'product__variants__size' 
        )
        
        return Cart.objects.select_related('owner').prefetch_related(
            Prefetch('items', queryset=items_qs)
        )

    def get_or_create_cart(self, request):

        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(owner=request.user)
            
            session_key = request.session.session_key
            if session_key:
                self._merge_session_cart(session_key, cart)
        else:
            
            if not request.session.session_key:
                request.session.create()
            session_key = request.session.session_key
            cart, created = Cart.objects.get_or_create(
                owner=None,
                session_key=session_key
            )
        return cart

    def _merge_session_cart(self, session_key, user_cart):
        
        try:
            session_cart = Cart.objects.prefetch_related('items').get(
                session_key=session_key, 
                owner=None
            )
            with transaction.atomic():
                for item in session_cart.items.all():
                    existing_item = user_cart.items.filter(
                        product=item.product,
                        variant=item.variant
                    ).first()
                    if existing_item:
                        
                        max_stock = item.variant.stock if item.variant else item.product.stock
                        new_qty = min(
                            existing_item.quantity + item.quantity,
                            max_stock
                        )
                        existing_item.quantity = new_qty
                        existing_item.save(update_fields=['quantity'])
                    else:
                        
                        item.cart = user_cart
                        item.save(update_fields=['cart'])
                        
                session_cart.delete()
        except Cart.DoesNotExist:
            pass

    def list(self, request, *args, **kwargs):
        
        cart = self.get_or_create_cart(request)
        
        cart = self.get_cart_queryset().get(pk=cart.pk)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @extend_schema(
        request=CartItemSerializer,
        responses={201: CartSerializer},
        description="Add a product to the cart. If product already exists, increases quantity. Validates stock availability."
    )
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        serializer = CartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product = serializer.validated_data['product']
        variant = serializer.validated_data.get('variant')
        quantity = serializer.validated_data.get('quantity', 1)
        
        cart = self.get_or_create_cart(request)
        
        with transaction.atomic():
            
            if variant:
                stock_obj = ProductVariant.objects.select_for_update().get(pk=variant.pk)
                variant_name = f" (Size: {stock_obj.size.name})"
            else:
                stock_obj = Product.objects.select_for_update().get(pk=product.pk)
                variant_name = ""


            cart_item = CartItem.objects.filter(
                cart=cart, 
                product=product,
                variant=variant
            ).first()
            
            current_cart_quantity = cart_item.quantity if cart_item else 0
            new_quantity = current_cart_quantity + quantity
            
            
            if new_quantity > stock_obj.stock:
                available = stock_obj.stock - current_cart_quantity
                return Response(
                    {
                        'error': f'Not enough stock{variant_name}. Available: {available}',
                        'available_stock': available,
                        'current_cart_quantity': current_cart_quantity
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if cart_item:
                cart_item.quantity = new_quantity
                cart_item.save(update_fields=['quantity'])
            else:
                CartItem.objects.create(
                    cart=cart,
                    product=product,
                    variant=variant,
                    quantity=new_quantity
                )
        
        cart = self.get_cart_queryset().get(pk=cart.pk)
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        
        cart = self.get_or_create_cart(request)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartItemViewSet(viewsets.GenericViewSet, 
                      mixins.UpdateModelMixin, 
                      mixins.DestroyModelMixin):
        
    serializer_class = CartItemUpdateSerializer
    permission_classes = [AllowAny]
    http_method_names = ['patch', 'delete']

    def get_queryset(self):
        queryset = CartItem.objects.select_related(
            'product__category',
            'cart__owner'
        )
        
        if self.request.user.is_authenticated:
            return queryset.filter(cart__owner=self.request.user)
        else:
            session_key = self.request.session.session_key
            if session_key:
                return queryset.filter(
                    cart__session_key=session_key,
                    cart__owner=None
                )
            return CartItem.objects.none()

    def update(self, request, *args, **kwargs):
        
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        new_quantity = serializer.validated_data.get('quantity', instance.quantity)
        
        # Validate stock
        with transaction.atomic():
            product = Product.objects.select_for_update().get(pk=instance.product.pk)
            
            if new_quantity > product.stock:
                return Response(
                    {
                        'error': f'Not enough stock. Available: {product.stock}',
                        'available_stock': product.stock
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if new_quantity <= 0:
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            
            serializer.save()
        
        
        cart = Cart.objects.prefetch_related('items__product').get(pk=instance.cart.pk)
        return Response(CartSerializer(cart).data)

    def destroy(self, request, *args, **kwargs):
        
        instance = self.get_object()
        cart_pk = instance.cart.pk
        instance.delete()
        
        
        cart = Cart.objects.prefetch_related('items__product').get(pk=cart_pk)
        return Response(CartSerializer(cart).data)
