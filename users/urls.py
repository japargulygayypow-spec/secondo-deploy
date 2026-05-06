from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, UserProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    
    # Login endpoint: Returns Access & Refresh Token
    # It will automatically expect "phone_number" and "password" 
    # because we set USERNAME_FIELD = 'phone_number' in the model.
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
]