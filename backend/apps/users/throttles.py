"""Limitation de débit sur les endpoints d'authentification."""
from rest_framework.throttling import ScopedRateThrottle


class AuthRateThrottle(ScopedRateThrottle):
    scope = 'auth'
