# Generated by Django 4.2.7 on 2024-04-09 10:55

from django.db import migrations


def fill_in_placeholder_source(apps, schema_editor):
    SpaceDescription = apps.get_model("space", "SpaceDescription")
    Source = apps.get_model("source", "Source")
    placeholder = Source.objects.get(name="MISSING SOURCE")
    for obj in SpaceDescription.objects.filter(source__isnull=True):
        obj.source = placeholder
        obj.save()


def clear_placeholder_source(apps, schema_editor):
    SpaceDescription = apps.get_model("space", "SpaceDescription")
    Source = apps.get_model("source", "Source")
    placeholder = Source.objects.get(name="MISSING SOURCE")
    for obj in SpaceDescription.objects.filter(source=placeholder):
        obj.source = None
        obj.save()


class Migration(migrations.Migration):

    dependencies = [
        ("space", "0004_spacedescription_source"),
        ("source", "0005_placeholder_source"),
    ]

    operations = [
        migrations.RunPython(
            fill_in_placeholder_source,
            reverse_code=clear_placeholder_source,
        )
    ]
