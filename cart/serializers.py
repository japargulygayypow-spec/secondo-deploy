from rest_framework import serializers
from django.db.models import F, Sum, DecimalField
from django.db.models.functions import Coalesce

from product.serializers import ProductSerializer
from .models import Cart, CartItem
from product.models import Product, ProductVariant


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for cart items with nested product details."""
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        write_only=True,
        source='product',
        required=False  # Make it optional
    )
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        write_only=True,
        source='variant',
        required=False,
        allow_null=True
    )
    variant = serializers.SerializerMethodField()
    sub_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'variant', 'variant_id', 'quantity', 'sub_total']

    def validate(self, data):
        """
        Custom validation:
        - If variant is provided but product is not, get product from variant
        - If both are provided, validate they match
        - If product has variants, require variant selection
        - If neither is provided, raise error
        """
        variant = data.get('variant')
        product = data.get('product')
        
        if variant and not product:
            # Automatically get product from variant
            data['product'] = variant.product
        elif not variant and not product:
            # Neither provided - error
            raise serializers.ValidationError(
                "Either 'product_id' or 'variant_id' must be provided."
            )
        elif variant and product:
            # Both provided - validate they match
            if variant.product_id != product.id:
                raise serializers.ValidationError(
                    "The variant does not belong to the specified product."
                )

        # Ensure product is active (covers case where product is derived from variant)
        if data.get('product') and not data['product'].is_active:
             raise serializers.ValidationError("This product is not available.")
        
        # CRITICAL: Check if product has variants and enforce variant selection
        product_obj = data.get('product')
        if product_obj:
            # Check if this product has any variants
            has_variants = product_obj.variants.exists()
            
            if has_variants and not variant:
                raise serializers.ValidationError({
                    "variant_id": "This product requires size selection. Please choose a size."
                })
            
            # If variant is provided, validate stock availability
            if variant:
                if variant.stock <= 0:
                    raise serializers.ValidationError({
                        "variant_id": f"Size {variant.size.name} is out of stock."
                    })
                
                # Check if requested quantity exceeds available stock
                quantity = data.get('quantity', 1)
                if quantity > variant.stock:
                    raise serializers.ValidationError({
                        "quantity": f"Only {variant.stock} items available for size {variant.size.name}."
                    })
        
        return data

    def get_variant(self, obj):
        """Return variant details if exists."""
        if obj.variant:
            return {
                'id': obj.variant.id,
                'size': obj.variant.size.name,
                'stock': obj.variant.stock
            }
        return None

    def get_sub_total(self, obj):
        """Calculate subtotal for this cart item."""
        return obj.product.discounted_price * obj.quantity


class CartItemUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating cart item quantity."""
    
    class Meta:
        model = CartItem
        fields = ['id', 'quantity']
        read_only_fields = ['id']

    def validate_quantity(self, value):
        """Validate that quantity is positive."""
        if value < 0:
            raise serializers.ValidationError("Quantity cannot be negative.")
        return value


class CartSerializer(serializers.ModelSerializer):
    """Serializer for the cart with computed total price."""
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'owner', 'items', 'items_count', 'total_price', 'created_at', 'updated_at']
        read_only_fields = ['owner', 'created_at', 'updated_at']

    def get_total_price(self, obj):
        # Calculate in Python to ensure discounted_price logic from model is used correctly
        # This handles the conditional discount logic (if discount > 0) reliably
        return sum(item.product.discounted_price * item.quantity for item in obj.items.all())

    def get_items_count(self, obj):
        """Get total number of items in cart."""
        if hasattr(obj, '_prefetched_objects_cache') and 'items' in obj._prefetched_objects_cache:
            return sum(item.quantity for item in obj.items.all())
        return obj.items.aggregate(total=Coalesce(Sum('quantity'), 0))['total']
