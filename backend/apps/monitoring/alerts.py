"""Vérification des seuils et déclenchement d'alertes."""
import logging
import os

from django.conf import settings

from .metrics import get_snapshot

logger = logging.getLogger('apps.monitoring')

ERROR_RATE_THRESHOLD = float(os.getenv('MONITORING_ERROR_RATE_THRESHOLD', '0.1'))
LATENCY_P95_THRESHOLD_MS = float(os.getenv('MONITORING_LATENCY_P95_THRESHOLD_MS', '1000'))
MIN_REQUESTS_FOR_ALERT = int(os.getenv('MONITORING_MIN_REQUESTS_FOR_ALERT', '10'))


def check_alerts():
    snapshot = get_snapshot()
    if snapshot['total_requests'] < MIN_REQUESTS_FOR_ALERT:
        return

    if snapshot['error_rate'] >= ERROR_RATE_THRESHOLD:
        _emit_alert(
            f"Taux d'erreur élevé : {snapshot['error_rate'] * 100:.1f}%",
            'error_rate',
            snapshot,
        )

    if snapshot['p95_latency_ms'] >= LATENCY_P95_THRESHOLD_MS:
        _emit_alert(
            f"Latence P95 élevée : {snapshot['p95_latency_ms']} ms",
            'latency',
            snapshot,
        )


def _emit_alert(message, alert_type, snapshot):
    logger.warning('%s | %s', alert_type, message)
    if not getattr(settings, 'SENTRY_DSN', ''):
        return
    try:
        import sentry_sdk
        sentry_sdk.capture_message(
            message,
            level='warning',
            extras={'alert_type': alert_type, **snapshot},
        )
    except Exception:
        logger.exception('Impossible d\'envoyer l\'alerte à Sentry')
