"""Persistance des métriques API."""
from django.db import models


class ApiMetrics(models.Model):
    key = models.CharField(max_length=32, unique=True, default='global')
    total_requests = models.PositiveIntegerField(default=0)
    error_count = models.PositiveIntegerField(default=0)
    status_codes = models.JSONField(default=dict, blank=True)
    latencies = models.JSONField(default=list, blank=True)

    class Meta:
        verbose_name = 'métriques API'
        verbose_name_plural = 'métriques API'

    def __str__(self):
        return f'Métriques ({self.total_requests} requêtes)'
