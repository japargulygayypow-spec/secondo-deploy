from decimal import Decimal
from django.test import TestCase, override_settings
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.db import connection, reset_queries

from .models import Category, Product, Size, ProductVariant


User = get_user_model()


class CategoryModelTests(TestCase):
    """Tests for Category model."""
    
    def test_category_creation(self):
        """Test creating a basic category."""
        category = Category.objects.create(name='Electronics', slug='electronics')
        self.assertEqual(str(category), 'Electronics')
        self.assertEqual(category.slug, 'electronics')
    
    def test_category_hierarchy(self):
        """Test parent-child category relationship."""
        parent = Category.objects.create(name='Clothing', slug='clothing')
        child = Category.objects.create(name='T-Shirts', slug='t-shirts', parent=parent)
        
        self.assertEqual(child.parent, parent)
        self.assertIn(child, parent.children.all())


class SizeModelTests(TestCase):
    """Tests for Size model."""
    
    def test_cloth_size_creation(self):
        """Test creating a clothing size."""
        size = Size.objects.create(name='M', size_type=Size.SizeType.CLOTH, order=2)
        self.assertEqual(str(size), 'M (Clothing)')
        self.assertEqual(size.size_type, 'cloth')
    
    def test_shoe_size_creation(self):
        """Test creating a shoe size."""
        size = Size.objects.create(name='42', size_type=Size.SizeType.SHOE, order=7)
        self.assertEqual(str(size), '42 (Shoe)')
        self.assertEqual(size.size_type, 'shoe')
    
    def test_size_ordering(self):
        """Test that sizes are ordered correctly."""
        Size.objects.create(name='L', size_type=Size.SizeType.CLOTH, order=3)
        Size.objects.create(name='S', size_type=Size.SizeType.CLOTH, order=1)
        Size.objects.create(name='M', size_type=Size.SizeType.CLOTH, order=2)
        
        sizes = list(Size.objects.values_list('name', flat=True))
        self.assertEqual(sizes, ['S', 'M', 'L'])


class ProductModelTests(TestCase):
    """Tests for Product model."""
    
    def setUp(self):
        self.category = Category.objects.create(name='Test Category', slug='test-category')
    
    def test_product_creation(self):
        """Test creating a basic product."""
        product = Product.objects.create(
            category=self.category,
            title='Test Product',
            description='Test description',
            price=Decimal('99.99'),
            stock=10
        )
        self.assertEqual(str(product), 'Test Product')
        self.assertEqual(product.price, Decimal('99.99'))
        self.assertTrue(product.is_active)


class ProductVariantModelTests(TestCase):
    """Tests for ProductVariant model."""
    
    def setUp(self):
        self.category = Category.objects.create(name='Clothing', slug='clothing')
        self.product = Product.objects.create(
            category=self.category,
            title='T-Shirt',
            price=Decimal('29.99'),
            stock=0
        )
        self.size_s = Size.objects.create(name='S', size_type=Size.SizeType.CLOTH, order=1)
        self.size_m = Size.objects.create(name='M', size_type=Size.SizeType.CLOTH, order=2)
    
    def test_variant_creation(self):
        """Test creating a product variant."""
        variant = ProductVariant.objects.create(
            product=self.product,
            size=self.size_m,
            stock=5
        )
        self.assertEqual(str(variant), 'T-Shirt - M')
        self.assertEqual(variant.stock, 5)
    
    def test_variant_unique_together(self):
        """Test that product-size combination is unique."""
        ProductVariant.objects.create(product=self.product, size=self.size_m, stock=5)
        
        with self.assertRaises(Exception):
            ProductVariant.objects.create(product=self.product, size=self.size_m, stock=3)


# ============================================================================
# API Tests
# ============================================================================

class CategoryAPITests(APITestCase):
    """Tests for Category API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            phone_number='1234567890',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        self.regular_user = User.objects.create_user(
            phone_number='0987654321',
            password='userpass123',
            first_name='Regular',
            last_name='User'
        )
        self.category = Category.objects.create(name='Electronics', slug='electronics')
    
    def test_list_categories_anonymous(self):
        """Test that anonymous users can list categories."""
        url = reverse('category-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_retrieve_category(self):
        """Test retrieving a single category."""
        url = reverse('category-detail', kwargs={'pk': self.category.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Electronics')
        self.assertEqual(response.data['slug'], 'electronics')
    
    def test_create_category_admin_only(self):
        """Test that only admin can create categories."""
        url = reverse('category-list')
        data = {'name': 'New Category', 'slug': 'new-category'}
        
        # Anonymous user - should fail
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Regular user - should fail
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user - should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_update_category_admin_only(self):
        """Test that only admin can update categories."""
        url = reverse('category-detail', kwargs={'pk': self.category.pk})
        data = {'name': 'Updated Electronics', 'slug': 'electronics'}
        
        # Regular user - should fail
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user - should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Electronics')
    
    def test_delete_category_admin_only(self):
        """Test that only admin can delete categories."""
        url = reverse('category-detail', kwargs={'pk': self.category.pk})
        
        # Regular user - should fail
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user - should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ProductAPITests(APITestCase):
    """Tests for Product API endpoints."""
    
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            phone_number='1234567890',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        self.regular_user = User.objects.create_user(
            phone_number='0987654321',
            password='userpass123',
            first_name='Regular',
            last_name='User'
        )
        self.category = Category.objects.create(name='Clothing', slug='clothing')
        self.product = Product.objects.create(
            category=self.category,
            title='Test Shirt',
            description='A nice shirt',
            price=Decimal('49.99'),
            stock=20,
            is_active=True
        )
        self.inactive_product = Product.objects.create(
            category=self.category,
            title='Inactive Product',
            price=Decimal('19.99'),
            stock=5,
            is_active=False
        )
    
    def test_list_products_anonymous(self):
        """Test that anonymous users can list active products only."""
        url = reverse('product-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only see active products
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], 'Test Shirt')
    
    def test_list_products_admin_sees_all(self):
        """Test that admin sees all products including inactive."""
        url = reverse('product-list')
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_retrieve_product(self):
        """Test retrieving a single product."""
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Shirt')
        self.assertEqual(response.data['price'], '49.99')
        self.assertEqual(response.data['category']['name'], 'Clothing')
    
    def test_product_response_includes_variants(self):
        """Test that product response includes variants."""
        size = Size.objects.create(name='M', size_type=Size.SizeType.CLOTH, order=2)
        ProductVariant.objects.create(product=self.product, size=size, stock=10)
        
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('variants', response.data)
        self.assertEqual(len(response.data['variants']), 1)
        self.assertEqual(response.data['variants'][0]['size']['name'], 'M')
        self.assertEqual(response.data['variants'][0]['stock'], 10)
    
    def test_create_product_admin_only(self):
        """Test that only admin can create products."""
        url = reverse('product-list')
        data = {
            'category_id': self.category.pk,
            'title': 'New Product',
            'description': 'Description',
            'price': '29.99',
            'stock': 15
        }
        
        # Anonymous user - should fail
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Regular user - should fail
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user - should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Product')
    
    def test_update_product_admin_only(self):
        """Test that only admin can update products."""
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        data = {'title': 'Updated Shirt', 'price': '59.99'}
        
        # Regular user - should fail
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user - should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Shirt')
        self.assertEqual(response.data['price'], '59.99')
    
    def test_delete_product_admin_only(self):
        """Test that only admin can delete products."""
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        
        # Regular user - should fail
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user - should succeed
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class ProductQueryOptimizationTests(TestCase):
    """Tests for query optimization (N+1 problem prevention)."""
    
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Clothing', slug='clothing')
        
        # Create sizes
        self.sizes = []
        for i, name in enumerate(['S', 'M', 'L', 'XL']):
            size = Size.objects.create(name=name, size_type=Size.SizeType.CLOTH, order=i)
            self.sizes.append(size)
        
        # Create multiple products with variants
        for i in range(5):
            product = Product.objects.create(
                category=self.category,
                title=f'Product {i}',
                price=Decimal('29.99'),
                stock=10
            )
            # Add variants to each product
            for size in self.sizes:
                ProductVariant.objects.create(
                    product=product,
                    size=size,
                    stock=5
                )
    
    @override_settings(DEBUG=True)
    def test_product_list_query_count(self):
        """
        Test that fetching products with variants uses optimized queries.
        Without optimization: 1 + N products + N*M variants = many queries
        With optimization: Should be constant (around 3-4 queries)
        """
        # Reset query log
        reset_queries()
        
        url = reverse('product-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Get query count
        query_count = len(connection.queries)
        
        # With proper prefetch_related, we should have at most 4 queries:
        # 1. Products with category (select_related)
        # 2. Variants (prefetch_related)
        # 3. Sizes for variants (select_related in Prefetch)
        # Plus maybe 1-2 for session/auth
        self.assertLessEqual(
            query_count, 
            6,  # Allowing some buffer for auth/session queries
            f"Too many queries executed: {query_count}. Expected <= 6 for optimized query."
        )
    
    @override_settings(DEBUG=True)
    def test_product_detail_query_count(self):
        """Test that fetching a single product is also optimized."""
        product = Product.objects.first()
        
        reset_queries()
        
        url = reverse('product-detail', kwargs={'pk': product.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        query_count = len(connection.queries)
        
        # Single product should need at most 4 queries
        self.assertLessEqual(
            query_count,
            6,
            f"Too many queries for single product: {query_count}"
        )


class SizeAPISerializerTests(APITestCase):
    """Tests for Size serialization in API responses."""
    
    def setUp(self):
        self.category = Category.objects.create(name='Shoes', slug='shoes')
        self.product = Product.objects.create(
            category=self.category,
            title='Running Shoes',
            price=Decimal('99.99'),
            stock=0
        )
        self.size_40 = Size.objects.create(name='40', size_type=Size.SizeType.SHOE, order=5)
        self.size_41 = Size.objects.create(name='41', size_type=Size.SizeType.SHOE, order=6)
        
        ProductVariant.objects.create(product=self.product, size=self.size_40, stock=3)
        ProductVariant.objects.create(product=self.product, size=self.size_41, stock=7)
    
    def test_variant_size_serialization(self):
        """Test that variant sizes are properly serialized."""
        url = reverse('product-detail', kwargs={'pk': self.product.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        variants = response.data['variants']
        self.assertEqual(len(variants), 2)
        
        # Check first variant
        variant_40 = next(v for v in variants if v['size']['name'] == '40')
        self.assertEqual(variant_40['size']['size_type'], 'shoe')
        self.assertEqual(variant_40['size']['size_type_display'], 'Shoe')
        self.assertEqual(variant_40['stock'], 3)
        
        # Check second variant
        variant_41 = next(v for v in variants if v['size']['name'] == '41')
        self.assertEqual(variant_41['stock'], 7)
