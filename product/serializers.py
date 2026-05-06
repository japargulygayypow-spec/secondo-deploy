from rest_framework import serializers
from .models import Category, Product, Size, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']


class SizeSerializer(serializers.ModelSerializer):
    size_type_display = serializers.CharField(source='get_size_type_display', read_only=True)
    
    class Meta:
        model = Size
        fields = ['id', 'name', 'size_type', 'size_type_display', 'order']


class ProductVariantSerializer(serializers.ModelSerializer):
    size = SizeSerializer(read_only=True)
    size_id = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(),
        source='size',
        write_only=True
    )
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'size_id', 'stock']


class ProductSerializer(serializers.ModelSerializer):

    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    variants = ProductVariantSerializer(many=True, read_only=True)
    has_variants = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 
            'category', 
            'category_id',
            'title',       # This will automatically be EN, RU, or TK
            'description', 
            'price', 
            'discount',
            'discounted_price',
            'image',
            'stock',
            'variants',
            'has_variants',
            'created_at'
        ]
    
    def get_has_variants(self, obj):
        """
        Return True if product has size variants.
        Uses prefetched data if available to avoid extra queries.
        """
        if hasattr(obj, '_prefetched_objects_cache') and 'variants' in obj._prefetched_objects_cache:
            return len(obj.variants.all()) > 0
        return obj.variants.exists()