import pytest


@pytest.mark.django_db
def test_health_ok(api_client):
    response = api_client.get('/api/health/')
    assert response.status_code == 200
    assert response.data['status'] == 'ok'
    assert response.data['database'] == 'ok'
