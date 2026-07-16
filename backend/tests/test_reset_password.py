import pytest
from django.contrib.auth.tokens import default_token_generator
from django.test import override_settings
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient

from apps.users.models import User


@pytest.mark.django_db
def test_reset_password_confirm(user):
    client = APIClient()
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    response = client.post('/api/auth/reset-password/confirm/', {
        'uid': uid,
        'token': token,
        'new_password': 'newpassword123',
    }, format='json')
    assert response.status_code == 200
    user.refresh_from_db()
    assert user.check_password('newpassword123')


@pytest.mark.django_db
@override_settings(DEBUG=True)
def test_reset_password_request_debug_returns_token(api_client, user):
    response = api_client.post('/api/auth/reset-password/request/', {
        'email': user.email,
    }, format='json')
    assert response.status_code == 200
    assert 'reset_uid' in response.data
    assert 'reset_token' in response.data


@pytest.mark.django_db
def test_admin_users_list_requires_staff(user, staff_user):
    client = APIClient()
    assert client.get('/api/auth/admin/users/').status_code == 401

    login = APIClient().post('/api/auth/login/', {
        'email': user.email,
        'password': 'userpass123',
    }, format='json')
    user_client = APIClient()
    user_client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')
    assert user_client.get('/api/auth/admin/users/').status_code == 403

    staff_login = APIClient().post('/api/auth/login/', {
        'email': staff_user.email,
        'password': 'staffpass123',
    }, format='json')
    staff_client = APIClient()
    staff_client.credentials(HTTP_AUTHORIZATION=f'Bearer {staff_login.data["access"]}')
    response = staff_client.get('/api/auth/admin/users/')
    assert response.status_code == 200
    emails = [u['email'] for u in response.data['results']]
    assert user.email in emails
