from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from monitoring.views import HealthView, MetricsView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", HealthView.as_view(), name="health"),
    path("api/monitoring/metrics/", MetricsView.as_view(), name="metrics"),
    path("api/auth/", include("users.urls")),
    path("api/contacts/", include("contacts.urls")),
    path("api/", include("articles.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
