from rest_framework.routers import DefaultRouter

from .views import ArticleViewSet

router = DefaultRouter(trailing_slash=True)
router.register(r'', ArticleViewSet, basename='article')

urlpatterns = router.urls
