import pytest

from articles.models import Article
from contacts.models import Contact
from users.models import User


@pytest.mark.django_db
def test_me_export_returns_personal_data(auth_client, user):
    Article.objects.create(
        title="Article perso",
        excerpt="Extrait",
        content="Contenu",
        author=user,
    )
    Contact.objects.create(
        name=user.full_name,
        email=user.email,
        subject="Contact",
        message="Message",
        consent_given=True,
    )
    response = auth_client.get("/api/auth/me/export/")
    assert response.status_code == 200
    assert response.data["profile"]["email"] == user.email
    assert len(response.data["articles"]) == 1
    assert len(response.data["contact_messages"]) == 1
    assert "exported_at" in response.data


@pytest.mark.django_db
def test_me_delete_removes_user_and_contacts(auth_client, user):
    Contact.objects.create(
        name=user.full_name,
        email=user.email,
        subject="Contact",
        message="Message",
        consent_given=True,
    )
    response = auth_client.delete("/api/auth/me/delete/")
    assert response.status_code == 204
    assert not User.objects.filter(pk=user.pk).exists()
    assert Contact.objects.filter(email__iexact=user.email).count() == 0


@pytest.mark.django_db
def test_me_delete_staff_forbidden(staff_user, staff_client):
    response = staff_client.delete("/api/auth/me/delete/")
    assert response.status_code == 403
    assert User.objects.filter(pk=staff_user.pk).exists()
