from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.utils.translation import gettext_lazy as _ 
from django.contrib.postgres.indexes import GinIndex


class Category(MPTTModel):
    name = models.CharField(_('Название'), max_length=100)
    
    parent = TreeForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='children',
        verbose_name=_('Родительская категория')
    )


    slug = models.SlugField(_('Слаг'), unique=True)

    class Meta:
        verbose_name = _('Категория')
        verbose_name_plural = _('Категории')

    def __str__(self):
        return self.name


class Size(models.Model):

    class SizeType(models.TextChoices):
        CLOTH = 'cloth', _('Одежда')
        SHOE = 'shoe', _('Обувь')
    
    name = models.CharField(_('Название размера'), max_length=20)
    
    size_type = models.CharField(
        _('Тип размера'),
        max_length=10,
        choices=SizeType.choices,
        default=SizeType.CLOTH
    )
    order = models.PositiveIntegerField(_('Порядок сортировки'), default=0)

    class Meta:
        verbose_name = _('Размер')
        verbose_name_plural = _('Размеры')
        ordering = ['size_type', 'order', 'name']
        unique_together = ['name', 'size_type']

    def __str__(self):
        return f"{self.name} ({self.get_size_type_display()})"


class Product(models.Model):

    category = TreeForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        related_name='products',
        verbose_name=_('Категория') 
    )
    title = models.CharField(_('Название'), max_length=255)
    description = models.TextField(_('Описание'), max_length=480, blank=True)
    price = models.DecimalField(_('Цена'), max_digits=10, decimal_places=2)
    image = models.ImageField(_('Изображение'), upload_to='products/', null=True, blank=True)
    discount = models.DecimalField(_('Скидка'), default=0, max_digits=5, decimal_places=2)

    @property
    def discounted_price(self):
        if self.discount > 0:
            return self.price * (1 - self.discount / 100)
        return self.price
    stock = models.PositiveIntegerField(_('Количество на складе'), default=10)
    is_active = models.BooleanField(_('Активен'), default=True)
    created_at = models.DateField(_('Дата создания'), auto_now_add=True)

    class Meta:
        indexes = [
            GinIndex(
                fields=['title'], 
                name='product_title_gin_idx', 
                opclasses=['gin_trgm_ops']
            ),
        ]
        verbose_name = _('Товар')
        verbose_name_plural = _('Товары')

    def __str__(self):
        return self.title
    


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name=_('Товар')
    )
    size = models.ForeignKey(
        Size,
        on_delete=models.CASCADE,
        related_name='product_variants',
        verbose_name=_('Размер')
    )
    stock = models.PositiveIntegerField(_('Количество на складе'), default=0)
    
    class Meta:
        verbose_name = _('Вариант товара')
        verbose_name_plural = _('Варианты товара')
        unique_together = ['product', 'size']
        ordering = ['size__order', 'size__name']

    def __str__(self):
        return f"{self.product.title} - {self.size.name}"