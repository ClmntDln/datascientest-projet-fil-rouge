import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_signup_creates_inactive_user(api_client):
    response = api_client.post(
        "/api/auth/signup/",
        {
            "first_name": "Nouveau",
            "last_name": "Membre",
            "email": "nouveau@weeb.local",
            "password": "nouveau123",
        },
        format="json",
    )
    assert response.status_code == 201
    assert "administrateur" in response.data["detail"]


@pytest.mark.django_db
def test_login_inactive_user_rejected(api_client, inactive_user):
    response = api_client.post(
        "/api/auth/login/",
        {"email": inactive_user.email, "password": "pending123"},
        format="json",
    )
    assert response.status_code == 400
    assert "activé" in str(response.data["detail"])


@pytest.mark.django_db
def test_login_active_user(api_client, user):
    response = api_client.post(
        "/api/auth/login/",
        {"email": user.email, "password": "userpass123"},
        format="json",
    )
    assert response.status_code == 200
    assert "access" in response.data
    assert "refresh" in response.data
    assert response.data["user"]["email"] == user.email


@pytest.mark.django_db
def test_me_requires_auth(api_client):
    assert api_client.get("/api/auth/me/").status_code == 401


@pytest.mark.django_db
def test_me_returns_profile(auth_client, user):
    response = auth_client.get("/api/auth/me/")
    assert response.status_code == 200
    assert response.data["email"] == user.email


@pytest.mark.django_db
def test_admin_users_list_requires_staff(user, auth_client, staff_client):
    client = APIClient()
    assert client.get("/api/auth/admin/users/").status_code == 401
    assert auth_client.get("/api/auth/admin/users/").status_code == 403

    response = staff_client.get("/api/auth/admin/users/")
    assert response.status_code == 200
    emails = [u["email"] for u in response.data["results"]]
    assert user.email in emails
