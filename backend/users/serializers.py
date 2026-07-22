from django.conf import settings
from django.contrib.auth import password_validation
from django.contrib.auth.tokens import default_token_generator
from django.utils import timezone
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from articles.models import Article
from articles.serializers import ArticleSerializer
from contacts.models import Contact
from contacts.serializers import ContactSerializer

from .emails import send_password_reset_email
from .models import User

RESET_DETAIL = (
    "Si un compte est associé à cet email, un lien de réinitialisation a été envoyé."
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "is_active", "is_staff")
        read_only_fields = fields

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_staff:
            data["is_superuser"] = instance.is_superuser
        return data


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        )
        read_only_fields = fields


class AdminUserPatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("is_active",)

    def validate(self, attrs):
        target = self.instance
        actor = self.context["request"].user
        new_active = attrs.get("is_active", target.is_active)

        if new_active is False and target.pk == actor.pk:
            raise serializers.ValidationError(
                {"detail": "Vous ne pouvez pas désactiver votre propre compte."}
            )
        if target.is_staff and not actor.is_superuser:
            raise serializers.ValidationError(
                {
                    "detail": (
                        "Seul un superutilisateur peut modifier le statut actif "
                        "d'un compte staff."
                    )
                }
            )
        return attrs


class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("first_name", "last_name", "email", "password")

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Un compte avec cet email existe déjà.")
        return value.lower()

    def create(self, validated_data):
        return User.objects.create_user(is_active=False, **validated_data)


class LoginSerializer(TokenObtainPairSerializer):
    username_field = "email"

    def validate(self, attrs):
        email = attrs.get("email", "")
        password = attrs.get("password")
        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password):
            raise serializers.ValidationError({"detail": "Identifiants invalides."})
        if not user.is_active:
            raise serializers.ValidationError(
                {"detail": "Votre compte n'est pas encore activé par un administrateur."}
            )

        refresh = self.get_token(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data,
        }


class ResetPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()

    def save(self, **kwargs):
        user = User.objects.filter(email__iexact=self.validated_data["email"]).first()
        response = {"detail": RESET_DETAIL}
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
            response["reset_uid"] = uid
            response["reset_token"] = token
        return response


class ResetPasswordConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value

    def validate(self, attrs):
        try:
            user_id = urlsafe_base64_decode(attrs["uid"]).decode()
            user = User.objects.filter(pk=user_id).first()
        except Exception:
            user = None

        if not user or not default_token_generator.check_token(user, attrs["token"]):
            raise serializers.ValidationError(
                {"token": "Le code de réinitialisation est invalide ou a expiré."}
            )

        attrs["user"] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class UserExportSerializer(serializers.Serializer):
    def to_representation(self, user):
        return {
            "profile": UserSerializer(user).data,
            "articles": ArticleSerializer(
                Article.objects.filter(author=user), many=True
            ).data,
            "contact_messages": ContactSerializer(
                Contact.objects.filter(email__iexact=user.email), many=True
            ).data,
            "exported_at": timezone.now().isoformat(),
        }
