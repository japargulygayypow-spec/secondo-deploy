from django.contrib import admin
from .models import Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    raw_id_fields = ('product',)

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'owner', 'session_key', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('owner__phone_number', 'session_key')
    inlines = [CartItemInline]
    ordering = ('-created_at',)

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'product', 'quantity')
    list_filter = ('cart',)
    search_fields = ('cart__owner__phone_number', 'product__title')
    raw_id_fields = ('cart', 'product')

