from django.conf import settings

ACCESS_COOKIE = "weeb_access"
REFRESH_COOKIE = "weeb_refresh"


def _cookie_kwargs(max_age):
    return {
        "httponly": True,
        "secure": getattr(settings, "SESSION_COOKIE_SECURE", not settings.DEBUG),
        "samesite": getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax"),
        "max_age": max_age,
    }


def set_auth_cookies(response, access, refresh):
    if access:
        response.set_cookie(
            ACCESS_COOKIE,
            access,
            **_cookie_kwargs(int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())),
        )
    if refresh:
        response.set_cookie(
            REFRESH_COOKIE,
            refresh,
            **_cookie_kwargs(int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())),
        )


def clear_auth_cookies(response):
    kwargs = {"samesite": getattr(settings, "AUTH_COOKIE_SAMESITE", "Lax")}
    if getattr(settings, "SESSION_COOKIE_SECURE", not settings.DEBUG):
        kwargs["secure"] = True
    response.delete_cookie(ACCESS_COOKIE, **kwargs)
    response.delete_cookie(REFRESH_COOKIE, **kwargs)
