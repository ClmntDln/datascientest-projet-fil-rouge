"""Vues d'authentification : signup, login JWT, reset, profil courant."""
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import User
from .permissions import IsStaffMember
from .serializers import (
    AdminUserPatchSerializer,
    AdminUserSerializer,
    LoginSerializer,
    ResetPasswordConfirmSerializer,
    ResetPasswordRequestSerializer,
    SignUpSerializer,
    UserSerializer,
)


def _reset_request_response(email):
    """Génère la réponse de demande de reset (message générique anti-énumération)."""
    user = User.objects.filter(email__iexact=email).first()
    response = {
        'detail': (
            'Si un compte est associé à cet email, un lien de réinitialisation '
            'a été généré.'
        )
    }
    if user and settings.DEBUG:
        response['reset_uid'] = urlsafe_base64_encode(force_bytes(user.pk))
        response['reset_token'] = default_token_generator.make_token(user)
    return response


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


class ResetPasswordRequestView(APIView):
    """Step 1 : demande de réinitialisation du mot de passe."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            _reset_request_response(serializer.validated_data['email']),
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(ResetPasswordRequestView):
    """Alias de compatibilité vers la demande de reset."""


class ResetPasswordConfirmView(APIView):
    """Step 2 : validation du token et changement de mot de passe."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordConfirmSerializer(data=request.data)
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


class AdminUserListView(generics.ListAPIView):
    """Liste des utilisateurs (activation des comptes)."""

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffMember]


class AdminUserPatchView(generics.UpdateAPIView):
    """Active ou désactive un utilisateur (champ is_active)."""

    queryset = User.objects.all()
    serializer_class = AdminUserPatchSerializer
    permission_classes = [permissions.IsAuthenticated, IsStaffMember]
    http_method_names = ['patch', 'head', 'options']

    def perform_update(self, serializer):
        target = self.get_object()
        actor = self.request.user
        new_active = serializer.validated_data.get('is_active')

        if new_active is False and target.pk == actor.pk:
            raise ValidationError(
                {'detail': 'Vous ne pouvez pas désactiver votre propre compte.'}
            )
        if target.is_staff and not actor.is_superuser:
            raise ValidationError(
                {
                    'detail': (
                        'Seul un superutilisateur peut modifier le statut actif '
                        "d'un compte staff."
                    )
                }
            )
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(AdminUserSerializer(instance).data)
