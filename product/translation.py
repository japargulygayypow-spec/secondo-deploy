from modeltranslation.translator import register, TranslationOptions
from .models import Category, Product

@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ('name',) # We want 'Men', 'Women' translated

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('title', 'description',) # Translating title and desc
    # Note: We do NOT translate 'price' or 'stock', those are universal.