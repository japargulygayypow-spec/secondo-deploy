from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.utils import timezone
from django.db.models import Q
from .models import Banner
from .serializers import BannerSerializer


class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Banner.objects.select_related('product').filter(is_active=True).order_by('order', '-created_at')
