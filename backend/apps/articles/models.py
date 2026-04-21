"""Modèle Article du blog Weeb."""
from django.conf import settings
from django.db import models


class Article(models.Model):
    """Article publié sur le blog par un utilisateur validé."""

    title = models.CharField('titre', max_length=200)
    excerpt = models.CharField('extrait', max_length=300)
    content = models.TextField('contenu')
    image = models.URLField('image', max_length=500, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='articles',
        verbose_name='auteur',
    )
    created_at = models.DateTimeField('créé le', auto_now_add=True)
    updated_at = models.DateTimeField('mis à jour le', auto_now=True)

    class Meta:
        verbose_name = 'article'
        verbose_name_plural = 'articles'
        ordering = ['-created_at']

    def __str__(self):
        return self.title
