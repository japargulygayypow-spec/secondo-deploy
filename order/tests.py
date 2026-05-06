from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from product.models import Category, Product, Size, ProductVariant
from .models import Order, OrderItem

User = get_user_model()

class OrderModelTests(TestCase):
    """Tests for Order and OrderItem models including variant support."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            phone_number='12345678', 
            password='pass',
            first_name='Test',
            last_name='User'
        )
        self.category = Category.objects.create(name='Shoes', slug='shoes')
        self.product = Product.objects.create(
            category=self.category,
            title='Sneakers',
            price=Decimal('50.00'),
            stock=10
        )
        self.size_42 = Size.objects.create(name='42', size_type=Size.SizeType.SHOE)
        self.variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size_42,
            stock=5
        )

    def test_order_item_creation_with_variant(self):
        """Test creating an order item with variant details."""
        order = Order.objects.create(
            user=self.user,
            full_name='John Doe',
            phone_number='12345678',
            address='Street 1'
        )
        
        item = OrderItem.objects.create(
            order=order,
            product=self.product,
            variant=self.variant,
            product_title=self.product.title,
            variant_name=self.variant.size.name,
            product_price=self.product.price,
            quantity=1
        )
        
        self.assertEqual(item.variant, self.variant)
        self.assertEqual(item.variant_name, '42')
        self.assertTrue('42' in str(item))

    def test_order_total_calculation(self):
        """Test that order total is calculated correctly."""
        order = Order.objects.create(
            user=self.user,
            full_name='John Doe',
            phone_number='12345678',
            address='Street 1'
        )
        
        # Item 1: 1 x Sneakers (50.00)
        OrderItem.objects.create(
            order=order,
            product=self.product,
            variant=self.variant,
            product_title=self.product.title,
            variant_name=self.variant.size.name,
            product_price=Decimal('50.00'),
            quantity=1
        )
        
        # Item 2: 2 x Sneakers (50.00 each)
        OrderItem.objects.create(
            order=order,
            product=self.product,
            variant=self.variant,
            product_title=self.product.title,
            variant_name=self.variant.size.name,
            product_price=Decimal('50.00'),
            quantity=2
        )
        
        total = order.calculate_total()
        self.assertEqual(total, Decimal('150.00')) # 50 + 100
        self.assertEqual(order.total_amount, Decimal('150.00'))
