# Generated by Django 4.2.7 on 2024-09-26 13:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("person", "0022_alter_agentdescription_options"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="agentdescription",
            name="designators",
        ),
    ]