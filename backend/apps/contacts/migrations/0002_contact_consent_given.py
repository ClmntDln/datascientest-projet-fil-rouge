# Generated manually for consent_given field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='consent_given',
            field=models.BooleanField(
                default=False,
                help_text='Consentement au traitement des données personnelles.',
                verbose_name='consentement RGPD',
            ),
        ),
    ]
