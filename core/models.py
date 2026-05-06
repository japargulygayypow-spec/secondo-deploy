from django.db import models
from django.utils.translation import gettext_lazy as _
from product.models import Product

class Banner(models.Model):
    """
    Banner linked to a specific product.
    Fetches title, description, and image from the product model.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='banners',
        verbose_name=_('Товар'),
        help_text=_('Выберите товар для баннера')
    )
    
    order = models.PositiveIntegerField(
        _('Порядок отображения'),
        default=0
    )
    
    is_active = models.BooleanField(
        _('Активен'),
        default=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Баннер')
        verbose_name_plural = _('Баннеры')
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"Banner: {self.product.title}"
