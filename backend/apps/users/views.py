"""Vues d'authentification : signup, login JWT, reset, profil courant."""
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.articles.models import Article
from apps.articles.serializers import ArticleSerializer
from apps.contacts.models import Contact
from apps.contacts.serializers import ContactSerializer

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
from .cookies import REFRESH_COOKIE, clear_auth_cookies, set_auth_cookies
from .emails import send_password_reset_email
from .throttles import AuthRateThrottle


def _reset_request_response(email):
    """Génère la réponse de demande de reset (message générique anti-énumération)."""
    user = User.objects.filter(email__iexact=email).first()
    response = {
        'detail': (
            'Si un compte est associé à cet email, un lien de réinitialisation '
            'a été envoyé.'
        )
    }
    if not user:
        return response
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    try:
        send_password_reset_email(user, uid, token)
    except Exception:
        if not settings.DEBUG:
            return response
    if settings.DEBUG:
        response['reset_uid'] = uid
        response['reset_token'] = token
    return response


class SignUpView(generics.CreateAPIView):
    """Création d'un compte utilisateur (inactif par défaut)."""

    serializer_class = SignUpSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    throttle_scope = 'auth'

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
    throttle_classes = [AuthRateThrottle]
    throttle_scope = 'auth'

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            set_auth_cookies(response, response.data.get('access'), response.data.get('refresh'))
        return response


class RefreshView(TokenRefreshView):
    """Rafraîchissement d'un access token."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        if not request.data.get('refresh') and request.COOKIES.get(REFRESH_COOKIE):
            request.data._mutable = True
            request.data['refresh'] = request.COOKIES[REFRESH_COOKIE]
            request.data._mutable = False
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            set_auth_cookies(response, response.data.get('access'), None)
        return response


class LogoutView(APIView):
    """Déconnexion : efface les cookies JWT."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response({'detail': 'Déconnexion effectuée.'})
        clear_auth_cookies(response)
        return response


class ResetPasswordRequestView(APIView):
    """Step 1 : demande de réinitialisation du mot de passe."""

    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    throttle_scope = 'auth'

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
    throttle_classes = [AuthRateThrottle]
    throttle_scope = 'auth'

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


class MeExportView(APIView):
    """Export RGPD des données personnelles de l'utilisateur connecté."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        articles = Article.objects.filter(author=user)
        contacts = Contact.objects.filter(email__iexact=user.email)
        return Response({
            'profile': UserSerializer(user).data,
            'articles': ArticleSerializer(articles, many=True).data,
            'contact_messages': ContactSerializer(contacts, many=True).data,
            'exported_at': timezone.now().isoformat(),
        })


class MeDeleteView(APIView):
    """Suppression du compte (droit à l'effacement RGPD)."""

    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        if user.is_staff:
            return Response(
                {
                    'detail': (
                        'Les comptes staff doivent être supprimés '
                        'par un superutilisateur.'
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        Contact.objects.filter(email__iexact=user.email).delete()
        user.delete()
        response = Response(status=status.HTTP_204_NO_CONTENT)
        clear_auth_cookies(response)
        return response


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
