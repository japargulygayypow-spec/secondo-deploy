from django.contrib import admin
from .models import Order, OrderItem
from django.utils.translation import gettext_lazy as _


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_title', 'product_price', 'quantity', 'sub_total']
    can_delete = False
    
    def sub_total(self, obj):
        return obj.sub_total
    sub_total.short_description = _('Подытог')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'full_name',
        'phone_number',
        'status',
        'total_amount',
        'created_at'
    ]
    list_filter = ['status', 'created_at']
    search_fields = ['full_name', 'phone_number', 'address']
    readonly_fields = ['user', 'session_key', 'total_amount', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        (_('Информация о клиенте'), {
            'fields': ('user', 'full_name', 'phone_number')
        }),
        (_('Адрес доставки'), {
            'fields': ('address', 'address_detail')
        }),
        (_('Детали заказа'), {
            'fields': ('status', 'total_amount', 'note')
        }),
        (_('Системная информация'), {
            'fields': ('session_key', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product_title', 'product_price', 'quantity', 'sub_total']
    list_filter = ['order__status']
    search_fields = ['product_title', 'order__full_name']
    
    def sub_total(self, obj):
        return obj.sub_total
    sub_total.short_description = _('Подытог')
