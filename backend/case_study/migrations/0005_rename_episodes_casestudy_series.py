# Generated by Django 4.2.7 on 2024-06-27 07:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("case_study", "0004_alter_casestudy_episodes"),
    ]

    operations = [
        migrations.RenameField(
            model_name="casestudy",
            old_name="episodes",
            new_name="series",
        ),
    ]