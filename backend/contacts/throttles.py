from rest_framework.throttling import ScopedRateThrottle


class ContactRateThrottle(ScopedRateThrottle):
    scope = "contact"
