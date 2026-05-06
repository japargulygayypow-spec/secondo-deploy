from rest_framework import viewsets
from rest_framework.pagination import PageNumberPagination
from django.db.models import Prefetch, Q
from .models import Product, Category, ProductVariant
from .serializers import ProductSerializer, CategorySerializer
from .permissions import IsAdminOrReadOnly
from django.contrib.postgres.search import TrigramSimilarity, TrigramWordSimilarity
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.functions import Greatest, Coalesce
from django.db.models import Value

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 60

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related(
        Prefetch(
            'variants',
            queryset=ProductVariant.objects.select_related('size')
        )
    ).all().order_by('-id')

    pagination_class = StandardResultsSetPagination
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            try:
                category = Category.objects.get(slug=category_slug)
                descendants = category.get_descendants(include_self=True)
                queryset = queryset.filter(category__in=descendants)
            except Category.DoesNotExist:
                return queryset.none()

        # Filter by category ID
        category_id = self.request.query_params.get('category_id')
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
                descendants = category.get_descendants(include_self=True)
                queryset = queryset.filter(category__in=descendants)
            except Category.DoesNotExist:
                return queryset.none()

        # Filter by discount
        if self.request.query_params.get('discounted') == 'true':
            queryset = queryset.filter(discount__gt=0)
            
        # Ordering
        ordering = self.request.query_params.get('ordering')
        if ordering:
            queryset = queryset.order_by(ordering)

        # If not staff, only show active products
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_active=True)
            
        return queryset

class ProductSearchView(APIView):
    permission_classes = [IsAdminOrReadOnly]
    
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response([])

        product = Product.objects.select_related('category').prefetch_related('variants','variants__size')
        products = product.annotate(
            best_score=Greatest(
                Coalesce(TrigramSimilarity('title', query), Value(0.0)),
                Coalesce(TrigramWordSimilarity(query, 'title'), Value(0.0)),
                Coalesce(TrigramSimilarity('title_en', query), Value(0.0)),
                Coalesce(TrigramWordSimilarity(query, 'title_en'), Value(0.0)),
                Coalesce(TrigramSimilarity('title_ru', query), Value(0.0)),
                Coalesce(TrigramWordSimilarity(query, 'title_ru'), Value(0.0)),
                Coalesce(TrigramSimilarity('title_tk', query), Value(0.0)),
                Coalesce(TrigramWordSimilarity(query, 'title_tk'), Value(0.0)),
            )
        ).filter(
            best_score__gt=0.3, 
            is_active=True
        ).order_by('-best_score')[:20]

        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)