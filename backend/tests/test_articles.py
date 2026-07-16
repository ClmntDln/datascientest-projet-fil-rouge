import pytest

from apps.articles.models import Article


@pytest.mark.django_db
def test_articles_list_public(api_client, user):
    Article.objects.create(
        title='Test',
        excerpt='Extrait',
        content='Contenu',
        author=user,
    )
    response = api_client.get('/api/articles/')
    assert response.status_code == 200
    data = response.data
    results = data['results'] if isinstance(data, dict) else data
    assert len(results) == 1


@pytest.mark.django_db
def test_article_create_requires_auth(api_client):
    response = api_client.post('/api/articles/', {
        'title': 'Sans auth',
        'excerpt': 'Extrait',
        'content': 'Contenu',
    }, format='json')
    assert response.status_code == 401


@pytest.mark.django_db
def test_article_create_by_authenticated_user(auth_client, user):
    response = auth_client.post('/api/articles/', {
        'title': 'Mon article',
        'excerpt': 'Extrait',
        'content': 'Contenu complet',
    }, format='json')
    assert response.status_code == 201
    assert response.data['author'] == user.id
    assert response.data['author_name'] == user.full_name


@pytest.mark.django_db
def test_article_update_by_non_owner_forbidden(auth_client, user):
    other = user.__class__.objects.create_user(
        email='other@weeb.local',
        password='otherpass123',
        first_name='Autre',
        last_name='Auteur',
        is_active=True,
    )
    article = Article.objects.create(
        title='Article d\'un autre',
        excerpt='Extrait',
        content='Contenu',
        author=other,
    )
    response = auth_client.patch(f'/api/articles/{article.id}/', {
        'title': 'Tentative',
    }, format='json')
    assert response.status_code == 403


@pytest.mark.django_db
def test_inactive_user_cannot_create_article(api_client, inactive_user):
    api_client.force_authenticate(user=inactive_user)
    response = api_client.post('/api/articles/', {
        'title': 'Tentative',
        'excerpt': 'Extrait',
        'content': 'Contenu',
    }, format='json')
    assert response.status_code == 403
