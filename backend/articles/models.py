"""Modèles pour les articles"""

from django.db import models
from django.conf import settings

class Article(models.Model):
    """Article publié sur le blog par un auteur validé"""
    
    title = models.CharField("titre", max_length=255)
    excerpt = models.CharField("extrait", max_length=300)
    content = models.TextField("contenu")
    image = models.ImageField("image", upload_to="articles/", null=True, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="articles",
        verbose_name="auteur",
        )
    created_at = models.DateTimeField("créé le", auto_now_add=True, editable=False)
    updated_at = models.DateTimeField("mis à jour le", auto_now=True, editable=False)
    
    class Meta:
        verbose_name = "article"
        verbose_name_plural = "articles"
        ordering = ["-created_at"]
    
    def __str__(self):
        return self.title
        
