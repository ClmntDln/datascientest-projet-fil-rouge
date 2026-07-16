"""Limitation de débit sur le formulaire de contact."""
from rest_framework.throttling import ScopedRateThrottle


class ContactRateThrottle(ScopedRateThrottle):
    scope = 'contact'
