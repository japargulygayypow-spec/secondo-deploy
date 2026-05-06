from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from product.models import Category, Product, Size, ProductVariant
from .models import Cart, CartItem

User = get_user_model()

class CartModelTests(TestCase):
    """Tests for Cart and CartItem models including variant support."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            phone_number='12345678', 
            password='pass',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(name='Clothing', slug='clothing')
        self.product = Product.objects.create(
            category=self.category,
            title='T-Shirt',
            price=Decimal('20.00'),
            stock=100
        )
        self.size_m = Size.objects.create(name='M', size_type=Size.SizeType.CLOTH)
        self.variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size_m,
            stock=50
        )

    def test_cart_item_creation_with_variant(self):
        """Test adding item with variant to cart."""
        cart = Cart.objects.create(owner=self.user)
        item = CartItem.objects.create(
            cart=cart,
            product=self.product,
            variant=self.variant,
            quantity=2
        )
        
        self.assertEqual(item.variant, self.variant)
        self.assertTrue('M' in str(item))
    
    def test_cart_unique_constraint(self):
        """Test distinct items for different variants of same product."""
        cart = Cart.objects.create(owner=self.user)
        
        size_l = Size.objects.create(name='L', size_type=Size.SizeType.CLOTH)
        variant_l = ProductVariant.objects.create(product=self.product, size=size_l, stock=50)
        
        # Add M size
        CartItem.objects.create(cart=cart, product=self.product, variant=self.variant, quantity=1)
        
        # Add L size - should be allowed (different variant)
        item_l = CartItem.objects.create(cart=cart, product=self.product, variant=variant_l, quantity=1)
        
        self.assertEqual(CartItem.objects.count(), 2)
