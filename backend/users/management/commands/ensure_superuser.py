import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()


class Command(BaseCommand):
    help = "Crée un superuser depuis les variables d'environnement (idempotent)."

    def handle(self, *args, **options):
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")
        if not email or not password:
            self.stdout.write("DJANGO_SUPERUSER_EMAIL/PASSWORD absents — superuser ignoré.")
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(f"Superuser déjà présent : {email}")
            return

        User.objects.create_superuser(
            email=email,
            password=password,
            first_name=os.environ.get("DJANGO_SUPERUSER_FIRST_NAME", "Admin"),
            last_name=os.environ.get("DJANGO_SUPERUSER_LAST_NAME", "Weeb"),
        )
        self.stdout.write(self.style.SUCCESS(f"Superuser créé : {email}"))
