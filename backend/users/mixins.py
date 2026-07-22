from rest_framework import permissions, status
from rest_framework.response import Response

from .cookies import REFRESH_COOKIE, set_auth_cookies
from .throttles import AuthRateThrottle


class AuthEndpointMixin:
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    throttle_scope = "auth"


class CookieJWTMixin:
    def finalize_token_response(self, response):
        if response.status_code == 200:
            set_auth_cookies(
                response,
                response.data.get("access"),
                response.data.get("refresh"),
            )
        return response


class RefreshCookieMixin(CookieJWTMixin):
    def get_serializer(self, *args, **kwargs):
        if "data" not in kwargs:
            data = self.request.data.copy()
            data.setdefault("refresh", self.request.COOKIES.get(REFRESH_COOKIE))
            kwargs["data"] = data
        return super().get_serializer(*args, **kwargs)


class SerializerPostMixin:
    response_from_save = False
    success_message = None

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if self.response_from_save:
            return Response(serializer.save(), status=status.HTTP_200_OK)
        serializer.save()
        return Response({"detail": self.success_message}, status=status.HTTP_200_OK)
