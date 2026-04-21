"""Modèle utilisateur personnalisé pour Weeb."""
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Gestionnaire d'utilisateurs basé sur l'email."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("L'email est obligatoire.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_active', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        if extra_fields.get('is_staff') is not True:
            raise ValueError('is_staff doit être à True pour un superuser.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('is_superuser doit être à True pour un superuser.')
        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Utilisateur authentifié par email. Inactif par défaut (validation admin)."""

    username = None
    email = models.EmailField('adresse email', unique=True)
    first_name = models.CharField('prénom', max_length=150)
    last_name = models.CharField('nom', max_length=150)
    is_active = models.BooleanField(
        'actif',
        default=False,
        help_text='Désignez si ce compte a été validé par un administrateur.',
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    class Meta:
        verbose_name = 'utilisateur'
        verbose_name_plural = 'utilisateurs'
        ordering = ['-date_joined']

    def __str__(self):
        return f'{self.first_name} {self.last_name} <{self.email}>'

    @property
    def full_name(self):
        return f'{self.first_name} {self.last_name}'.strip()
