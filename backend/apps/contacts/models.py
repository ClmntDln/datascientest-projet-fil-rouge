"""Modèle Contact : messages reçus via le formulaire public."""
from django.db import models


class Contact(models.Model):
    name = models.CharField('nom', max_length=150)
    email = models.EmailField('email')
    subject = models.CharField('sujet', max_length=200)
    message = models.TextField('message')
    created_at = models.DateTimeField('reçu le', auto_now_add=True)

    class Meta:
        verbose_name = 'message de contact'
        verbose_name_plural = 'messages de contact'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.subject} — {self.email}'
