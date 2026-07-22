"""URLs pour les articles"""
from rest_framework.routers import DefaultRouter

from .views import ArticleViewSet

router = DefaultRouter(trailing_slash=True)
router.register(r'articles', ArticleViewSet, basename='article')

urlpatterns = router.urls