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


@pytest.mark.django_db
def test_signup_duplicate_email_rejected(api_client, user):
    response = api_client.post(
        "/api/auth/signup/",
        {
            "first_name": "Autre",
            "last_name": "Membre",
            "email": user.email,
            "password": "autrepass123",
        },
        format="json",
    )
    assert response.status_code == 400
    assert "email" in response.data


@pytest.mark.django_db
def test_signup_weak_password_rejected(api_client):
    response = api_client.post(
        "/api/auth/signup/",
        {
            "first_name": "Nouveau",
            "last_name": "Membre",
            "email": "faible@weeb.local",
            "password": "1234",
        },
        format="json",
    )
    assert response.status_code == 400
    assert "password" in response.data


@pytest.mark.django_db
def test_refresh_returns_new_access_token(api_client, user):
    login = api_client.post(
        "/api/auth/login/",
        {"email": user.email, "password": "userpass123"},
        format="json",
    )
    response = api_client.post(
        "/api/auth/refresh/",
        {"refresh": login.data["refresh"]},
        format="json",
    )
    assert response.status_code == 200
    assert "access" in response.data


@pytest.mark.django_db
def test_refresh_without_token_returns_401(api_client):
    response = api_client.post("/api/auth/refresh/", {}, format="json")
    assert response.status_code == 401


@pytest.mark.django_db
def test_logout_blacklists_refresh_token(api_client, user):
    login = api_client.post(
        "/api/auth/login/",
        {"email": user.email, "password": "userpass123"},
        format="json",
    )
    refresh = login.data["refresh"]

    logout_response = api_client.post(
        "/api/auth/logout/", {"refresh": refresh}, format="json"
    )
    assert logout_response.status_code == 200

    reuse_response = api_client.post(
        "/api/auth/refresh/", {"refresh": refresh}, format="json"
    )
    assert reuse_response.status_code == 401


@pytest.mark.django_db
def test_admin_can_activate_user(staff_client, inactive_user):
    response = staff_client.patch(
        f"/api/auth/admin/users/{inactive_user.id}/",
        {"is_active": True},
        format="json",
    )
    assert response.status_code == 200
    inactive_user.refresh_from_db()
    assert inactive_user.is_active is True


@pytest.mark.django_db
def test_admin_cannot_deactivate_own_account(staff_client, staff_user):
    response = staff_client.patch(
        f"/api/auth/admin/users/{staff_user.id}/",
        {"is_active": False},
        format="json",
    )
    assert response.status_code == 400


@pytest.mark.django_db
def test_staff_cannot_modify_other_staff_account(staff_client, staff_user):
    other_staff = staff_user.__class__.objects.create_user(
        email="autre-staff@weeb.local",
        password="autrestaff123",
        first_name="Autre",
        last_name="Staff",
        is_active=True,
        is_staff=True,
    )
    response = staff_client.patch(
        f"/api/auth/admin/users/{other_staff.id}/",
        {"is_active": False},
        format="json",
    )
    assert response.status_code == 400
