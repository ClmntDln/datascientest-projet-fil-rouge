# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='ApiMetrics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.CharField(default='global', max_length=32, unique=True)),
                ('total_requests', models.PositiveIntegerField(default=0)),
                ('error_count', models.PositiveIntegerField(default=0)),
                ('status_codes', models.JSONField(blank=True, default=dict)),
                ('latencies', models.JSONField(blank=True, default=list)),
            ],
            options={
                'verbose_name': 'métriques API',
                'verbose_name_plural': 'métriques API',
            },
        ),
    ]
