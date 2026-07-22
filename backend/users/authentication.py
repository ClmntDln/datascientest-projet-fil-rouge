from rest_framework_simplejwt.authentication import JWTAuthentication

from .cookies import ACCESS_COOKIE


class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        cookie_token = request.COOKIES.get(ACCESS_COOKIE)
        if cookie_token:
            validated = self.get_validated_token(cookie_token)
            return self.get_user(validated), validated
        return super().authenticate(request)
