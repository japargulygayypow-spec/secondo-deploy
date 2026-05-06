from django.contrib import admin
from mptt.admin import DraggableMPTTAdmin
from modeltranslation.admin import TranslationAdmin
from .models import Category, Product, Size, ProductVariant
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.utils.translation import gettext_lazy as _
from django.urls import resolve

class ProductInline(admin.TabularInline):
    """
    Inline для отображения товаров в категории и всех её подкатегориях.
    """
    model = Product
    extra = 1
    fields = ('image', 'title', 'category', 'price', 'stock', 'is_active')
    show_change_link = True
    verbose_name = _('Товары в этой категории')
    verbose_name_plural = _('Товары в этой категории')

    def get_queryset(self, request):
        """
        Override to show products from this category and all descendants.
        """
        qs = super().get_queryset(request)
        
        # Extract the category ID from the URL path
        # URL format: /admin/product/category/{id}/change/
        try:
            resolved = resolve(request.path_info)
            object_id = resolved.kwargs.get('object_id')
            if object_id:
                category = Category.objects.get(pk=object_id)
                # Get all descendant category IDs including self
                descendant_ids = category.get_descendants(include_self=True).values_list('id', flat=True)
                return qs.filter(category_id__in=descendant_ids)
        except (Category.DoesNotExist, KeyError):
            pass
        
        return qs

    def get_formset(self, request, obj=None, **kwargs):
        """
        Make category editable only for new products (so they get assigned to current category).
        """
        formset = super().get_formset(request, obj, **kwargs)
        return formset

@admin.register(Category)
class CategoryAdmin(TranslationAdmin, DraggableMPTTAdmin):
    """
    Admin for Category with multilingual support and drag-and-drop tree structure.
    Supports English, Russian, and Turkmen languages.
    """
    # 'tree_actions' shows the drag handle.
    # 'indented_title' shows the name indented by level.
    list_display = ('tree_actions', 'indented_title', 'slug', 'id', 'product_count')
    
    # Clicking the name opens the edit page
    list_display_links = ('indented_title',)
    
    # Auto-fill the slug from the name (uses the default language 'name' field)
    prepopulated_fields = {'slug': ('name',)}
    
    # Search functionality - search across all language variants
    search_fields = ('name', 'name_en', 'name_ru', 'name_tk')
    
    # Pixel indentation for child categories
    mptt_level_indent = 20

    # Optional: Helper to show how many products are in each category
    def product_count(self, obj):
        return obj.products.count()
    product_count.short_description = 'Количество товаров'

@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    """
    Admin panel for Size management.
    """
    list_display = ('name', 'size_type', 'order', 'id')
    list_filter = ('size_type',)
    list_editable = ('order',)
    search_fields = ('name',)
    ordering = ('size_type', 'order', 'name')


class ProductVariantInline(admin.TabularInline):
    """
    Inline for product variants (sizes with stock).
    """
    model = ProductVariant
    extra = 1
    fields = ('id', 'size', 'stock')
    readonly_fields = ('id',)  # ID must be read-only
    autocomplete_fields = ['size']

@admin.register(Product)
class ProductAdmin(TranslationAdmin):
    """
    Удобная и наглядная админка для товаров с поддержкой мультиязычности.
    """
    list_display = (
        'image_preview',
        'title', 
        'category_link', 
        'price',
        'discount',
        'discounted_price', 
        'formatted_price',
        'stock',
        'stock_indicator', 
        'id', 
    )
    list_filter = (
        ('category', admin.RelatedOnlyFieldListFilter),
        'price',
    )
    list_editable = ('price', 'stock', 'discount')
    readonly_fields = ('discounted_price',)
    
    # Search functionality - search across all language variants for title and description
    search_fields = (
        'title', 'title_en', 'title_ru', 'title_tk',
        'description', 'description_en', 'description_ru', 'description_tk'
    )
    
    inlines = [ProductVariantInline]

    list_per_page = 20
    
    # Группировка полей для удобства редактирования
    fieldsets = (
        (_('Основная информация'), {
            'fields': ('image', 'title', 'category', 'description')
        }),
        (_('Цены и Склад'), {
            'fields': (('price', 'discount', 'discounted_price', 'stock', 'is_active',),),
            'classes': ('wide',),
            'description': _('Управляйте размерами и запасами для каждого размера ниже.')
        }),
    )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "category":
            kwargs["level_indicator"] = '\u00a0' * 4
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

    def category_link(self, obj):
        return obj.category.name if obj.category else "-"
    category_link.short_description = _('Категория')
    category_link.admin_order_field = 'category'

    def formatted_price(self, obj):
        return format_html(
            '<span style="font-weight: 600; color: #2e7d32;">{} TMM</span>', 
            obj.price
        )
    formatted_price.short_description = _('Цена')
    formatted_price.admin_order_field = 'price'

    def stock_indicator(self, obj):
        if obj.stock <= 0:
            color = '#d32f2f' # Red
            text = _('Нет в наличии')
        elif obj.stock <= 5:
            color = '#f57c00' # Orange
            text = f'{_("Мало")} ({obj.stock})'
        else:
            color = '#388e3c' # Green
            text = f'{_("В наличии")} ({obj.stock})'
            
        return format_html(
            '<div style="display: flex; align-items: center;">'
            '<div style="width: 10px; height: 10px; border-radius: 50%; background-color: {}; margin-right: 8px;"></div>'
            '<span>{}</span>'
            '</div>',
            color, text
        )
    stock_indicator.short_description = _('Статус')
    stock_indicator.admin_order_field = 'stock'

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />')
        return "-"
    image_preview.short_description = _('Предпросмотр')