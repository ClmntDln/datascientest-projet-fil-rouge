"""Serializers pour l'authentification et les utilisateurs."""
from django.contrib.auth import authenticate, password_validation
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Représentation publique d'un utilisateur."""

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'is_active', 'is_staff')
        read_only_fields = fields


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


class ResetPasswordSerializer(serializers.Serializer):
    """Réinitialisation simplifiée : email + nouveau mot de passe."""

    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def save(self, **kwargs):
        email = self.validated_data['email']
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            raise serializers.ValidationError({'detail': 'Aucun compte associé à cet email.'})
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user
