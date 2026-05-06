from rest_framework import serializers
from django.db import transaction
from django.db.models import Sum

from .models import Order, OrderItem
from cart.models import Cart, CartItem


class OrderItemSerializer(serializers.ModelSerializer):
    sub_total = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product',
            'product_title',
            'product_price',
            'quantity',
            'sub_total'
        ]
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for viewing order details."""
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'full_name',
            'phone_number',
            'address',
            'address_detail',
            'note',
            'status',
            'status_display',
            'total_amount',
            'items',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'id',
            'user',
            'status',
            'total_amount',
            'created_at',
            'updated_at'
        ]


class CheckoutSerializer(serializers.ModelSerializer):
    """
    Serializer for checkout/creating an order.
    Auto-fills user info if authenticated.
    """
    
    class Meta:
        model = Order
        fields = [
            'full_name',
            'phone_number',
            'address',
            'address_detail',
            'note'
        ]
    
    def validate_phone_number(self, value):
        """Ensure phone number is digits only and max 8 digits."""
        if not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits.")
        if len(value) > 8:
            raise serializers.ValidationError("Phone number must be at most 8 digits.")
        return value
    
    def create(self, validated_data):
        """
        Create order from cart items.
        - Links to user if authenticated
        - Copies cart items to order items
        - Clears the cart after successful order
        - Decrements product stock
        """
        request = self.context.get('request')
        user = request.user if request.user.is_authenticated else None
        
        # Get cart
        cart = self._get_cart(request)
        if not cart or not cart.items.exists():
            raise serializers.ValidationError(
                {"cart": "Your cart is empty. Add items before checkout."}
            )
        
        with transaction.atomic():
            # Create order
            order = Order.objects.create(
                user=user,
                session_key=request.session.session_key if not user else None,
                **validated_data
            )
            
            total_amount = 0
            
            # Create order items from cart items (already prefetched)
            # Need to prefetch variants too
            cart_items = cart.items.select_related('product', 'variant__size').filter(quantity__gt=0)
            
            for cart_item in cart_items:
                product = cart_item.product
                variant = cart_item.variant
                
                # Check stock availability
                if variant:
                    if cart_item.quantity > variant.stock:
                        raise serializers.ValidationError({
                            "stock": f"Insufficient stock for {product.title} (Size: {variant.size.name}). "
                                     f"Available: {variant.stock}"
                        })
                else:
                    if cart_item.quantity > product.stock:
                        raise serializers.ValidationError({
                            "stock": f"Insufficient stock for {product.title}. "
                                     f"Available: {product.stock}"
                        })
                
                # Determine variant name
                variant_name = variant.size.name if variant else ""

                # Create order item with product snapshot
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_title=product.title,
                    product_price=product.discounted_price,
                    variant=variant,        # Save variant
                    variant_name=variant_name, # Save variant name
                    quantity=cart_item.quantity
                )
                
                total_amount += order_item.sub_total
                
                # Decrement stock
                if variant:
                    variant.stock -= cart_item.quantity
                    variant.save(update_fields=['stock'])
                else:
                    product.stock -= cart_item.quantity
                    product.save(update_fields=['stock'])
            
            # Update order total
            order.total_amount = total_amount
            order.save(update_fields=['total_amount'])
            
            # Clear cart after successful order
            cart.items.all().delete()
        
        return order
    
    def _get_cart(self, request):
        """Get cart for current user or session with prefetched items."""
        base_qs = Cart.objects.prefetch_related('items__product')
        
        if request.user.is_authenticated:
            return base_qs.filter(owner=request.user).first()
        else:
            session_key = request.session.session_key
            if session_key:
                return base_qs.filter(
                    session_key=session_key,
                    owner=None
                ).first()
        return None


class OrderListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for order list."""
    items_count = serializers.SerializerMethodField()
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            'id',
            'full_name',
            'status',
            'status_display',
            'total_amount',
            'items_count',
            'created_at'
        ]
    
    def get_items_count(self, obj):
        """Get total quantity of items in order."""
        if hasattr(obj, '_prefetched_objects_cache') and 'items' in obj._prefetched_objects_cache:
            return sum(item.quantity for item in obj.items.all())
        return obj.items.aggregate(
            total=Sum('quantity')
        )['total'] or 0
