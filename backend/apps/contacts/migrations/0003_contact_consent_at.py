from django.db import migrations, models
from django.utils import timezone


def set_consent_at(apps, schema_editor):
    Contact = apps.get_model('contacts', 'Contact')
    Contact.objects.filter(consent_given=True, consent_at__isnull=True).update(
        consent_at=timezone.now(),
    )


class Migration(migrations.Migration):

    dependencies = [
        ('contacts', '0002_contact_consent_given'),
    ]

    operations = [
        migrations.AddField(
            model_name='contact',
            name='consent_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='consentement le'),
        ),
        migrations.RunPython(set_consent_at, migrations.RunPython.noop),
    ]
