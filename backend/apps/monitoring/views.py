"""Endpoints de supervision : santé et métriques."""
from django.db import connection
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.permissions import IsStaffMember

from .alerts import ERROR_RATE_THRESHOLD, LATENCY_P95_THRESHOLD_MS
from .metrics import get_snapshot


class HealthView(APIView):
    """Vérifie la disponibilité de l'API et de la base de données."""

    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        db_ok = self._check_database()
        payload = {
            'status': 'ok' if db_ok else 'degraded',
            'database': 'ok' if db_ok else 'error',
        }
        code = status.HTTP_200_OK if db_ok else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(payload, status=code)

    @staticmethod
    def _check_database():
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
            return True
        except Exception:
            return False


class MetricsView(APIView):
    """Indicateurs de performance (réservé au staff)."""

    permission_classes = [permissions.IsAuthenticated, IsStaffMember]

    def get(self, request):
        snapshot = get_snapshot()
        return Response({
            **snapshot,
            'alerts': {
                'error_rate_threshold': ERROR_RATE_THRESHOLD,
                'latency_p95_threshold_ms': LATENCY_P95_THRESHOLD_MS,
            },
        })
