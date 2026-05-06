from order.tasks import send_new_order_email
from django.db import transaction
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action

from .models import Order
from .serializers import (
    OrderSerializer,
    OrderListSerializer,
    CheckoutSerializer
)


class OrderViewSet(viewsets.GenericViewSet,
                   mixins.ListModelMixin,
                   mixins.RetrieveModelMixin):
                   
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'checkout':
            return CheckoutSerializer
        if self.action == 'list':
            return OrderListSerializer
        return OrderSerializer
    
    def get_queryset(self):
        
        queryset = Order.objects.prefetch_related(
            'items__product'
        ).select_related('user')
        
        if self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if session_key:
                return queryset.filter(
                    session_key=session_key,
                    user=None
                )
            return Order.objects.none()
    
    @action(detail=False, methods=['post'])
    def checkout(self, request):
        
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        
        if request.user.is_authenticated:
            
            if not data.get('full_name'):
                data['full_name'] = f"{request.user.first_name} {request.user.last_name}".strip()
            if not data.get('phone_number'):
                
                phone = request.user.phone_number
                data['phone_number'] = phone[-8:] if len(phone) > 8 else phone
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            order = serializer.save()
            
            transaction.on_commit(
                lambda: send_new_order_email.delay(order.id)
            )
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['get'])
    def prefill(self, request):
        
        if request.user.is_authenticated:
            user = request.user
            return Response({
                'full_name': f"{user.first_name} {user.last_name}".strip(),
                'phone_number': user.phone_number[-8:] if len(user.phone_number) > 8 else user.phone_number,
                'address': '',
                'address_detail': '',
                'note': ''
            })
        return Response({
            'full_name': '',
            'phone_number': '',
            'address': '',
            'address_detail': '',
            'note': ''
        })
