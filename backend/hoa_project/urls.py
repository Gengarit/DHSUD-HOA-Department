from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hoa_registry.views import (
    HOAProfileViewSet, NOVViewSet, OTPViewSet, 
    OIASViewSet, SanctionViewSet
)

router = DefaultRouter()
router.register(r'hoa-profiles', HOAProfileViewSet, basename='hoa-profile')
router.register(r'nov', NOVViewSet, basename='nov')
router.register(r'otp', OTPViewSet, basename='otp')
router.register(r'oias', OIASViewSet, basename='oias')
router.register(r'sanctions', SanctionViewSet, basename='sanction')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
