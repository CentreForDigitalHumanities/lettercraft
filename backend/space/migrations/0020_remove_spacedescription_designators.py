# Generated by Django 4.2.7 on 2024-09-26 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("space", "0019_alter_spacedescription_options"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="spacedescription",
            name="designators",
        ),
    ]