from django.contrib import admin
from .models import Banner
from django.utils.html import format_html


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['get_product_title', 'get_product_price', 'order', 'is_active']
    list_filter = ['is_active', 'created_at', 'order']
    list_editable = ['order', 'is_active']
    ordering = ['order', '-created_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('product', 'is_active', 'order'),
        }),
    )
    
    def get_product_title(self, obj):
        return obj.product.title
    get_product_title.short_description = 'Товар'
    
    def get_product_price(self, obj):
        return f"{obj.product.price} ({obj.product.discounted_price if obj.product.discount > 0 else ''})"
    get_product_price.short_description = 'Цена'
