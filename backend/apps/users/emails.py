"""Envoi d'emails transactionnels."""
from django.conf import settings
from django.core.mail import send_mail


def send_password_reset_email(user, uid, token):
    reset_url = (
        f"{settings.FRONTEND_URL.rstrip('/')}/reset-password"
        f"?uid={uid}&token={token}"
    )
    send_mail(
        subject='Réinitialisation de votre mot de passe Weeb',
        message=(
            f"Bonjour {user.first_name},\n\n"
            f"Pour réinitialiser votre mot de passe, ouvrez ce lien :\n{reset_url}\n\n"
            "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )
