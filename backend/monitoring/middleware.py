import time

from django.utils.deprecation import MiddlewareMixin

from .alerts import check_alerts
from .metrics import record_request


class RequestMetricsMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request._monitoring_start = time.perf_counter()

    def process_response(self, request, response):
        start = getattr(request, "_monitoring_start", None)
        if start is not None and request.path.startswith("/api/"):
            if not request.path.startswith("/api/health"):
                latency_ms = (time.perf_counter() - start) * 1000
                record_request(response.status_code, latency_ms)
                check_alerts()
        return response
