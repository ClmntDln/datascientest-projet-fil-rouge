"""Vues d'authentification : signup, login JWT, reset, profil courant."""
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from contacts.models import Contact

from .cookies import REFRESH_COOKIE, clear_auth_cookies
from .mixins import (
    AuthEndpointMixin,
    CookieJWTMixin,
    RefreshCookieMixin,
    SerializerPostMixin,
)
from .models import User
from .permissions import IsStaffMember
from .serializers import (
    AdminUserPatchSerializer,
    AdminUserSerializer,
    LoginSerializer,
    ResetPasswordConfirmSerializer,
    ResetPasswordRequestSerializer,
    SignUpSerializer,
    UserExportSerializer,
    UserSerializer,
)


class SignUpView(AuthEndpointMixin, generics.CreateAPIView):
    serializer_class = SignUpSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Compte créé. Un administrateur doit valider votre inscription."},
            status=status.HTTP_201_CREATED,
        )


class LoginView(AuthEndpointMixin, CookieJWTMixin, TokenObtainPairView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        return self.finalize_token_response(super().post(request, *args, **kwargs))


class RefreshView(RefreshCookieMixin, TokenRefreshView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        refresh = request.data.get("refresh") or request.COOKIES.get(REFRESH_COOKIE)
        if not refresh:
            return Response(
                {"detail": "Token de rafraîchissement absent."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        return self.finalize_token_response(super().post(request, *args, **kwargs))


class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh = request.data.get("refresh") or request.COOKIES.get(REFRESH_COOKIE)
        if refresh:
            try:
                RefreshToken(refresh).blacklist()
            except TokenError:
                pass
        response = Response({"detail": "Déconnexion effectuée."})
        clear_auth_cookies(response)
        return response


class ResetPasswordRequestView(AuthEndpointMixin, SerializerPostMixin, generics.GenericAPIView):
    serializer_class = ResetPasswordRequestSerializer
    response_from_save = True


class ResetPasswordConfirmView(AuthEndpointMixin, SerializerPostMixin, generics.GenericAPIView):
    serializer_class = ResetPasswordConfirmSerializer
    success_message = "Mot de passe réinitialisé avec succès."


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class MeExportView(generics.RetrieveAPIView):
    serializer_class = UserExportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class MeDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        if user.is_staff:
            raise PermissionDenied(
                "Les comptes staff doivent être supprimés par un superutilisateur."
            )
        Contact.objects.filter(email__iexact=user.email).delete()
        user.delete()
        response = Response(status=status.HTTP_204_NO_CONTENT)
        clear_auth_cookies(response)
        return response


class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffMember]


class AdminUserPatchView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserPatchSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffMember]
    http_method_names = ["patch", "head", "options"]

    def update(self, request, *args, **kwargs):
        super().update(request, *args, **kwargs)
        return Response(AdminUserSerializer(self.get_object()).data)
