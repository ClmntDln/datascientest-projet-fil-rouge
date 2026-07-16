"""Serializers pour l'authentification et les utilisateurs."""
from django.contrib.auth import password_validation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Représentation publique d'un utilisateur."""

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser')
        read_only_fields = fields


class AdminUserSerializer(serializers.ModelSerializer):
    """Liste des utilisateurs pour l'espace admin (staff)."""

    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'is_active',
            'is_staff',
            'is_superuser',
            'date_joined',
        )
        read_only_fields = fields


class AdminUserPatchSerializer(serializers.ModelSerializer):
    """Mise à jour du statut actif par un administrateur."""

    class Meta:
        model = User
        fields = ('is_active',)


class SignUpSerializer(serializers.ModelSerializer):
    """Inscription : crée un utilisateur inactif en attente de validation."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'password')

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('Un compte avec cet email existe déjà.')
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(is_active=False, **validated_data)


class LoginSerializer(TokenObtainPairSerializer):
    """JWT : refuse la connexion si le compte n'est pas activé."""

    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = User.objects.filter(email__iexact=email).first()

        if user is None:
            raise serializers.ValidationError({'detail': 'Identifiants invalides.'})
        if not user.check_password(password):
            raise serializers.ValidationError({'detail': 'Identifiants invalides.'})
        if not user.is_active:
            raise serializers.ValidationError(
                {'detail': "Votre compte n'est pas encore activé par un administrateur."}
            )

        data = super().validate(attrs)
        data['user'] = UserSerializer(user).data
        return data


class ResetPasswordRequestSerializer(serializers.Serializer):
    """Demande de réinitialisation de mot de passe (Step 1)."""

    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()


class ResetPasswordConfirmSerializer(serializers.Serializer):
    """Confirmation de la réinitialisation de mot de passe (Step 2)."""

    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate(self, attrs):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.http import urlsafe_base64_decode

        try:
            user_id = urlsafe_base64_decode(attrs['uid']).decode()
            user = User.objects.filter(pk=user_id).first()
        except Exception:
            user = None

        if not user or not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError(
                {'token': 'Le code de réinitialisation est invalide ou a expiré.'}
            )

        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
