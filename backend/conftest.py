import pytest
from django.core.cache import cache
from rest_framework.settings import api_settings
from rest_framework.test import APIClient

from users.models import User


@pytest.fixture(autouse=True)
def clear_throttle_cache():
    api_settings.reload()
    cache.clear()
    yield
    api_settings.reload()
    cache.clear()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="user@weeb.local",
        password="userpass123",
        first_name="Jean",
        last_name="Dupont",
        is_active=True,
    )


@pytest.fixture
def inactive_user(db):
    return User.objects.create_user(
        email="pending@weeb.local",
        password="pending123",
        first_name="En",
        last_name="Attente",
        is_active=False,
    )


@pytest.fixture
def staff_user(db):
    return User.objects.create_user(
        email="staff@weeb.local",
        password="staffpass123",
        first_name="Admin",
        last_name="Weeb",
        is_active=True,
        is_staff=True,
    )


@pytest.fixture
def auth_client(user):
    client = APIClient()
    response = client.post(
        "/api/auth/login/",
        {"email": user.email, "password": "userpass123"},
        format="json",
    )
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    return client


@pytest.fixture
def staff_client(staff_user):
    client = APIClient()
    response = client.post(
        "/api/auth/login/",
        {"email": staff_user.email, "password": "staffpass123"},
        format="json",
    )
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    return client
