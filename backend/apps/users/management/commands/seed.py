"""Commande de démonstration : crée un superuser et quelques articles."""
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.articles.models import Article

User = get_user_model()

DEMO_ARTICLES = [
    {
        'title': "Pourquoi React reste une référence en 2026",
        'excerpt': "Tour d'horizon des raisons qui font de React la bibliothèque privilégiée des équipes front-end.",
        'content': (
            "React continue de dominer l'écosystème front-end grâce à son modèle déclaratif,"
            " sa communauté immense et l'arrivée du React Compiler.\n\n"
            "Dans cet article, nous explorons les nouveautés qui rendent React incontournable"
            " pour les applications modernes."
        ),
    },
    {
        'title': "Vite : le build tool qui change tout",
        'excerpt': "Pourquoi Vite a supplanté Webpack dans la majorité des projets front-end.",
        'content': (
            "Démarrage instantané, HMR ultra-rapide, configuration minimale : Vite a redéfini"
            " les standards du tooling JavaScript.\n\n"
            "Découvrons comment il s'appuie sur esbuild et Rollup pour offrir la meilleure"
            " expérience développeur possible."
        ),
    },
    {
        'title': "Accessibilité web : les bases à ne pas oublier",
        'excerpt': "Un rappel des bonnes pratiques WCAG pour un web inclusif.",
        'content': (
            "L'accessibilité n'est pas une option. Contrastes suffisants, navigation clavier,"
            " attributs ARIA pertinents, structure sémantique…\n\n"
            "Voici les fondamentaux pour rendre vos interfaces utilisables par toutes et tous."
        ),
    },
]


class Command(BaseCommand):
    help = "Crée un superuser admin@weeb.local / admin1234 et des articles de démo."

    def handle(self, *args, **options):
        admin_email = 'admin@weeb.local'
        admin, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'first_name': 'Admin',
                'last_name': 'Weeb',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True,
            },
        )
        if created:
            admin.set_password('admin1234')
            admin.save()
            self.stdout.write(self.style.SUCCESS(f'Superuser créé : {admin_email} / admin1234'))
        else:
            self.stdout.write(f'Superuser déjà présent : {admin_email}')

        author_email = 'redacteur@weeb.local'
        author, created = User.objects.get_or_create(
            email=author_email,
            defaults={
                'first_name': 'Léa',
                'last_name': 'Dupont',
                'is_active': True,
            },
        )
        if created:
            author.set_password('redacteur1234')
            author.save()
            self.stdout.write(self.style.SUCCESS(f'Rédacteur créé : {author_email} / redacteur1234'))

        for item in DEMO_ARTICLES:
            Article.objects.get_or_create(
                title=item['title'],
                defaults={
                    'excerpt': item['excerpt'],
                    'content': item['content'],
                    'author': author,
                },
            )
        self.stdout.write(self.style.SUCCESS(f'{len(DEMO_ARTICLES)} article(s) de démo vérifié(s).'))
