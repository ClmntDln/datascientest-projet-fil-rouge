import pytest
from django.contrib.auth.tokens import default_token_generator
from django.test import override_settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_reset_password_confirm(user):
    client = APIClient()
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    response = client.post(
        "/api/auth/reset-password/confirm/",
        {"uid": uid, "token": token, "new_password": "newpassword123"},
        format="json",
    )
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.check_password("newpassword123")


@pytest.mark.django_db
@override_settings(DEBUG=True)
def test_reset_password_request_debug_returns_token(api_client, user):
    response = api_client.post(
        "/api/auth/reset-password/request/",
        {"email": user.email},
        format="json",
    )
    assert response.status_code == 200
    assert "reset_uid" in response.data
    assert "reset_token" in response.data


@pytest.mark.django_db
def test_reset_password_confirm_invalid_token_rejected(user):
    client = APIClient()
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    response = client.post(
        "/api/auth/reset-password/confirm/",
        {"uid": uid, "token": "token-invalide", "new_password": "newpassword123"},
        format="json",
    )
    assert response.status_code == 400
    assert "token" in response.data
    user.refresh_from_db()
    assert user.check_password("userpass123")


@pytest.mark.django_db
def test_reset_password_request_unknown_email_returns_generic_message(api_client):
    response = api_client.post(
        "/api/auth/reset-password/request/",
        {"email": "inconnu@weeb.local"},
        format="json",
    )
    assert response.status_code == 200
    assert "associé" in response.data["detail"]
    assert "reset_uid" not in response.data


@pytest.mark.django_db
@override_settings(DEBUG=False)
def test_reset_password_request_outside_debug_hides_token(api_client, user):
    response = api_client.post(
        "/api/auth/reset-password/request/",
        {"email": user.email},
        format="json",
    )
    assert response.status_code == 200
    assert "reset_uid" not in response.data
    assert "reset_token" not in response.data
