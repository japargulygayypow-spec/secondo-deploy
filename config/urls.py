from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from django.http import JsonResponse
from django.views.static import serve

def health_check(request):
    return JsonResponse({'ok': True, 'service': 'Secondo Zerlig API'})

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    # Swagger UI:
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # users (app)
    path('api/auth/', include('users.urls')),  

    # product (app)
    path('api/catalog/', include('product.urls')),
    
    # cart (app)
    path('api/', include('cart.urls')),
    
    # order (app)
    path('api/orders/', include('order.urls')),
    
    # core (app) - banners, etc.
    path('api/', include('core.urls')),
]

if settings.DEBUG:
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        urlpatterns += [path('__debug__/', include('debug_toolbar.urls'))]

    if 'silk' in settings.INSTALLED_APPS:
        urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
    
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# Demo media serving for product/banner images on Render. For a real store, use S3/Cloudinary later.
urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
