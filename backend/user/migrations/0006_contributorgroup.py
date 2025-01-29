# Generated by Django 4.2.7 on 2025-01-29 16:08

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0006_source_edition_author_source_edition_title_and_more'),
        ('user', '0005_remove_user_is_contributor'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContributorGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('sources', models.ManyToManyField(blank=True, related_name='contributor_groups', to='source.source')),
                ('users', models.ManyToManyField(blank=True, related_name='contributor_groups', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
