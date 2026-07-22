from django.utils import timezone
from rest_framework import serializers

from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    consent_given = serializers.BooleanField(write_only=True)

    class Meta:
        model = Contact
        fields = ("id", "name", "email", "subject", "message", "consent_given", "consent_at", "created_at")
        read_only_fields = ("id", "consent_at", "created_at")

    def validate_consent_given(self, value):
        if not value:
            raise serializers.ValidationError(
                "Vous devez accepter le traitement de vos données personnelles."
            )
        return value

    def create(self, validated_data):
        validated_data.pop("consent_given", None)
        validated_data["consent_given"] = True
        validated_data["consent_at"] = timezone.now()
        return super().create(validated_data)
