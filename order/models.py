from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator
from product.models import Product, ProductVariant


class Order(models.Model):

    class OrderStatus(models.TextChoices):
        PENDING = 'pending', _('В ожидании')
        CONFIRMED = 'confirmed', _('Подтвержден')
        PROCESSING = 'processing', _('В обработке')
        SHIPPED = 'shipped', _('Отправлен')
        DELIVERED = 'delivered', _('Доставлен')
        CANCELLED = 'cancelled', _('Отменен')
    
    # User (optional - for logged in users)
    user = models.ForeignKey( 
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,            
        blank=True,           
        related_name='orders',
        verbose_name=_('Пользователь')
    )
    
    # Checkout fields (required for all users)
    full_name = models.CharField(_('Полное имя'), max_length=100)
    phone_number = models.CharField(
        _('Номер телефона'),
        max_length=8,
        validators=[
            RegexValidator(
                regex=r'^\d{1,8}$',
                message=_('Номер телефона должен содержать до 8 цифр.')
            )
        ]
    )
    address = models.CharField(_('Адрес'), max_length=255)
    address_detail = models.CharField(
        _('Дополнительная информация об адресе'),
        max_length=255,
        blank=True
    )
    note = models.TextField(_('Примечание'), blank=True)
    
    # Order details
    status = models.CharField(
        _('Статус'),
        max_length=20,
        choices=OrderStatus.choices,
        default=OrderStatus.PENDING
    )

    total_amount = models.DecimalField(
        _('Общая сумма'),
        max_digits=12,
        decimal_places=2,
        default=0
    )
    
    # Session key for anonymous orders
    session_key = models.CharField(
        _('Ключ сессии'),
        max_length=40,
        null=True,
        blank=True,
        db_index=True
    )
    
    # Timestamps
    created_at = models.DateTimeField(_('Дата создания'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Дата обновления'), auto_now=True)
    
    class Meta:
        verbose_name = _('Заказ')
        verbose_name_plural = _('Заказы')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order #{self.id} - {self.full_name}"
    
    def calculate_total(self):
        """Calculate and update total amount from order items."""
        total = sum(item.sub_total for item in self.items.all())
        self.total_amount = total
        return total


class OrderItem(models.Model):
                                
    order = models.ForeignKey(
        Order,                  
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_('Заказ')
    )

    product = models.ForeignKey(
        Product,
        on_delete=models.SET_NULL,
        null=True,
        related_name='order_items',
        verbose_name=_('Товар')
    )
    
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_('Вариант')
    )
    
    # Snapshot of product details at time of order
    product_title = models.CharField(_('Название товара'), max_length=255)
    variant_name = models.CharField(_('Название варианта'), max_length=50, blank=True)
    product_price = models.DecimalField(
        _('Цена товара'),
        max_digits=10,
        decimal_places=2
    )
    quantity = models.PositiveIntegerField(_('Количество'), default=1)
    
    class Meta:
        verbose_name = _('Элемент заказа')
        verbose_name_plural = _('Элементы заказа')
    
    def __str__(self):
        if self.variant_name:
            return f"{self.quantity} x {self.product_title} ({self.variant_name})"
        return f"{self.quantity} x {self.product_title}"
    
    @property
    def sub_total(self):
        """Calculate subtotal for this item."""
        if self.product_price is None:
            return 0
        return self.product_price * self.quantity