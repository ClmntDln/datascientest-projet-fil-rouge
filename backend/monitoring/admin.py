from django.contrib import admin

from .models import ApiMetrics


@admin.register(ApiMetrics)
class ApiMetricsAdmin(admin.ModelAdmin):
    list_display = ("key", "total_requests", "error_count")
    readonly_fields = ("key", "total_requests", "error_count", "status_codes", "latencies")

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
