# Generated by Django 4.2.7 on 2024-05-17 13:15

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("event", "0016_remove_eventdescription_source_location_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="eventdescriptionagent",
            name="source_terminology",
        ),
        migrations.RemoveField(
            model_name="eventdescriptiongift",
            name="source_terminology",
        ),
        migrations.RemoveField(
            model_name="eventdescriptionletter",
            name="source_terminology",
        ),
        migrations.RemoveField(
            model_name="eventdescriptionspace",
            name="source_terminology",
        ),
        migrations.AddField(
            model_name="eventdescription",
            name="designators",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(max_length=200),
                blank=True,
                default=list,
                help_text="Relevant (Latin) terminology used to describe this entity in the source text",
                size=5,
            ),
        ),
    ]