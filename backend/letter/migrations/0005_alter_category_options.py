# Generated by Django 4.2.7 on 2024-01-31 17:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('letter', '0004_make_letter_name_unique'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name': 'letter category', 'verbose_name_plural': 'letter categories'},
        ),
    ]
