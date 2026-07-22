from django.db import models


class Contact(models.Model):
    name = models.CharField("nom", max_length=150)
    email = models.EmailField("email")
    subject = models.CharField("sujet", max_length=200)
    message = models.TextField("message")
    consent_given = models.BooleanField(
        "consentement RGPD",
        default=False,
        help_text="Consentement au traitement des données personnelles.",
    )
    consent_at = models.DateTimeField("consentement le", null=True, blank=True)
    created_at = models.DateTimeField("reçu le", auto_now_add=True)

    class Meta:
        verbose_name = "message de contact"
        verbose_name_plural = "messages de contact"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.subject} — {self.email}"
