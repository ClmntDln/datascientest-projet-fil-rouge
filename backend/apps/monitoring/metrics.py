"""Collecte et persistance des métriques de performance API."""
from django.db import transaction

from .models import ApiMetrics

MAX_LATENCIES = 1000


def _get_or_create():
    metrics, _ = ApiMetrics.objects.get_or_create(key='global')
    return metrics


def record_request(status_code, latency_ms):
    with transaction.atomic():
        metrics = ApiMetrics.objects.select_for_update().get_or_create(key='global')[0]
        metrics.total_requests += 1
        if status_code >= 400:
            metrics.error_count += 1
        codes = dict(metrics.status_codes or {})
        key = str(status_code)
        codes[key] = codes.get(key, 0) + 1
        metrics.status_codes = codes
        latencies = list(metrics.latencies or [])
        latencies.append(round(latency_ms, 2))
        metrics.latencies = latencies[-MAX_LATENCIES:]
        metrics.save()


def get_snapshot():
    metrics = _get_or_create()
    latencies = list(metrics.latencies or [])
    total = metrics.total_requests
    errors = metrics.error_count
    avg = sum(latencies) / len(latencies) if latencies else 0
    p95 = sorted(latencies)[max(0, int(len(latencies) * 0.95) - 1)] if latencies else 0
    return {
        'total_requests': total,
        'error_count': errors,
        'error_rate': round(errors / total, 4) if total else 0,
        'avg_latency_ms': round(avg, 2),
        'p95_latency_ms': round(p95, 2),
        'status_codes': dict(metrics.status_codes or {}),
    }


def reset_metrics():
    ApiMetrics.objects.filter(key='global').delete()
