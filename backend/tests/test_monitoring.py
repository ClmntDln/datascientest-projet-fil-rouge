import pytest
from rest_framework.test import APIClient

from apps.monitoring.metrics import get_snapshot, record_request, reset_metrics


@pytest.fixture(autouse=True)
def clear_metrics():
    reset_metrics()
    yield
    reset_metrics()


@pytest.mark.django_db
def test_metrics_records_requests(api_client):
    api_client.get('/api/articles/')
    api_client.get('/api/articles/')
    snapshot = get_snapshot()
    assert snapshot['total_requests'] == 2
    assert '200' in snapshot['status_codes']


@pytest.mark.django_db
def test_health_not_counted_in_metrics(api_client):
    api_client.get('/api/health/')
    assert get_snapshot()['total_requests'] == 0


@pytest.mark.django_db
def test_metrics_endpoint_requires_staff(user, staff_user):
    client = APIClient()
    client.get('/api/articles/')
    assert client.get('/api/monitoring/metrics/').status_code == 401

    login = APIClient().post('/api/auth/login/', {
        'email': user.email,
        'password': 'userpass123',
    }, format='json')
    user_client = APIClient()
    user_client.credentials(HTTP_AUTHORIZATION=f'Bearer {login.data["access"]}')
    assert user_client.get('/api/monitoring/metrics/').status_code == 403

    staff_login = APIClient().post('/api/auth/login/', {
        'email': staff_user.email,
        'password': 'staffpass123',
    }, format='json')
    staff_client = APIClient()
    staff_client.credentials(HTTP_AUTHORIZATION=f'Bearer {staff_login.data["access"]}')
    response = staff_client.get('/api/monitoring/metrics/')
    assert response.status_code == 200
    assert 'total_requests' in response.data
    assert 'alerts' in response.data


@pytest.mark.django_db
def test_metrics_snapshot_error_rate():
    record_request(200, 50)
    record_request(500, 120)
    snapshot = get_snapshot()
    assert snapshot['error_count'] == 1
    assert snapshot['error_rate'] == 0.5


@pytest.mark.django_db
def test_alerts_trigger_on_high_error_rate(settings, caplog):
    from apps.monitoring.alerts import check_alerts

    settings.SENTRY_DSN = ''
    for _ in range(10):
        record_request(500, 100)
    with caplog.at_level('WARNING', logger='apps.monitoring'):
        check_alerts()
    assert any('error_rate' in record.message for record in caplog.records)
