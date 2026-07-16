"""Routes principales du projet Weeb."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.monitoring.views import HealthView, MetricsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', HealthView.as_view(), name='health'),
    path('api/monitoring/metrics/', MetricsView.as_view(), name='metrics'),
    path('api/auth/', include('apps.users.urls')),
    path('api/articles/', include('apps.articles.urls')),
    path('api/contacts/', include('apps.contacts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
