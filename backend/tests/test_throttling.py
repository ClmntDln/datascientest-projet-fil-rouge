import pytest
from django.core.cache import cache
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_contact_throttling():
    cache.clear()
    client = APIClient()
    payload = {
        'name': 'Test',
        'email': 'test@weeb.local',
        'subject': 'Sujet',
        'message': 'Message',
        'consent_given': True,
    }
    for i in range(5):
        response = client.post('/api/contacts/', {
            **payload,
            'email': f'test{i}@weeb.local',
        }, format='json')
        assert response.status_code == 201

    blocked = client.post('/api/contacts/', {
        **payload,
        'email': 'blocked@weeb.local',
    }, format='json')
    assert blocked.status_code == 429
