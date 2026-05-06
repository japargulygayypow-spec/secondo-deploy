from rest_framework import serializers
from .models import Banner
from product.models import Product

class BannerSerializer(serializers.ModelSerializer):
    """
    Serializer for Banner model, now optimized to fetch fields from linked Product.
    """
    # Fetch details directly from linked product
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_description = serializers.CharField(source='product.description', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    product_discounted_price = serializers.DecimalField(source='product.discounted_price', max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)
    product_id = serializers.IntegerField(source='product.id', read_only=True)
    product_category_slug = serializers.CharField(source='product.category.slug', read_only=True)
    
    class Meta:
        model = Banner
        fields = [
            'id',
            'product_id',
            'product_title',
            'product_description',
            'product_price',
            'product_discounted_price',
            'product_image',
            'product_category_slug',
            'order'
        ]
