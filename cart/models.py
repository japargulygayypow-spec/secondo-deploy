from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from product.models import Product, ProductVariant

class Cart(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='carts',
        verbose_name=_('Владелец')
    )
    session_key = models.CharField(
        max_length=40, 
        null=True, 
        blank=True, 
        db_index=True,
        verbose_name=_('Ключ сессии')
    )
    created_at = models.DateTimeField(_('Дата создания'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Дата обновления'), auto_now=True)

    class Meta:
        verbose_name = _('Корзина')
        verbose_name_plural = _('Корзины')

    def __str__(self):
        return f"Cart #{self.id} - {self.owner if self.owner else 'Anonymous'}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, 
        on_delete=models.CASCADE, 
        related_name='items',
        verbose_name=_('Корзины')
    )
    product = models.ForeignKey(
        Product, 
        on_delete=models.CASCADE,
        verbose_name=_('Товар')
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Вариант')
    )
    quantity = models.PositiveIntegerField(_('Количество'), default=1)

    class Meta:
        verbose_name = _('Элемент корзины')
        verbose_name_plural = _('Элементы корзины')
        unique_together = ('cart', 'product', 'variant')

    def __str__(self):
        if self.variant:
            return f"{self.quantity} x {self.product.title} ({self.variant.size.name})"
        return f"{self.quantity} x {self.product.title}"


