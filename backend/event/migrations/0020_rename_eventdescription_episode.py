# Generated by Django 4.2.7 on 2024-06-27 08:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("letter", "0015_remove_giftdescriptionsender_agent_and_more"),
        ("source", "0006_source_edition_author_source_edition_title_and_more"),
        ("space", "0016_settlement_regions"),
        ("person", "0018_alter_personreference_description_and_more"),
        ("event", "0019_rename_events_series_episodes"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="EventDescription",
            new_name="Episode",
        ),
    ]
