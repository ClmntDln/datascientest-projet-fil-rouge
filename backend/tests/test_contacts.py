import pytest


@pytest.mark.django_db
def test_contact_requires_consent(api_client):
    response = api_client.post(
        "/api/contacts/",
        {
            "name": "Visiteur",
            "email": "visiteur@weeb.local",
            "subject": "Question",
            "message": "Bonjour",
            "consent_given": False,
        },
        format="json",
    )
    assert response.status_code == 400
    assert "consent_given" in response.data


@pytest.mark.django_db
def test_contact_create_with_consent(api_client):
    response = api_client.post(
        "/api/contacts/",
        {
            "name": "Visiteur",
            "email": "visiteur@weeb.local",
            "subject": "Question",
            "message": "Bonjour",
            "consent_given": True,
        },
        format="json",
    )
    assert response.status_code == 201
    assert "consent_given" not in response.data


@pytest.mark.django_db
def test_contact_invalid_email_rejected(api_client):
    response = api_client.post(
        "/api/contacts/",
        {
            "name": "Visiteur",
            "email": "pas-un-email",
            "subject": "Question",
            "message": "Bonjour",
            "consent_given": True,
        },
        format="json",
    )
    assert response.status_code == 400
    assert "email" in response.data


@pytest.mark.django_db
def test_contact_list_requires_staff(api_client, auth_client, staff_client):
    api_client.post(
        "/api/contacts/",
        {
            "name": "Visiteur",
            "email": "visiteur@weeb.local",
            "subject": "Question",
            "message": "Bonjour",
            "consent_given": True,
        },
        format="json",
    )

    assert api_client.get("/api/contacts/").status_code == 401
    assert auth_client.get("/api/contacts/").status_code == 403

    response = staff_client.get("/api/contacts/")
    assert response.status_code == 200
    assert len(response.data["results"]) == 1
