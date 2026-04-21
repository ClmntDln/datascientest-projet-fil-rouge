"""Vues d'authentification : signup, login JWT, reset, profil courant."""
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import (
    LoginSerializer,
    ResetPasswordSerializer,
    SignUpSerializer,
    UserSerializer,
)


class SignUpView(generics.CreateAPIView):
    """Création d'un compte utilisateur (inactif par défaut)."""

    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                'detail': "Compte créé. Un administrateur doit valider votre inscription.",
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(TokenObtainPairView):
    """Connexion : retourne access + refresh JWT si le compte est actif."""

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]


class RefreshView(TokenRefreshView):
    """Rafraîchissement d'un access token."""

    permission_classes = [permissions.AllowAny]


class ResetPasswordView(APIView):
    """Réinitialisation simplifiée du mot de passe (démonstration)."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {'detail': 'Mot de passe réinitialisé avec succès.'},
            status=status.HTTP_200_OK,
        )


class MeView(generics.RetrieveAPIView):
    """Retourne les informations de l'utilisateur authentifié."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
