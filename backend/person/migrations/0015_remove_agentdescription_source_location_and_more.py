# Generated by Django 4.2.7 on 2024-04-25 11:51

from django.db import migrations, models


def migrate_source_location_to_page(apps, schema_editor):
    AgentDescription = apps.get_model("person", "AgentDescription")
    for agent_description in AgentDescription.objects.all():
        if agent_description.source_location:
            agent_description.page = agent_description.source_location
            agent_description.save()


def migrate_page_to_source_location(apps, schema_editor):
    AgentDescription = apps.get_model("person", "AgentDescription")
    for agent_description in AgentDescription.objects.all():
        if agent_description.page:
            agent_description.source_location = agent_description.page
            agent_description.save()


class Migration(migrations.Migration):

    dependencies = [
        ("person", "0014_alter_persondateofbirth_person_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="agentdescription",
            name="book",
            field=models.CharField(
                blank=True, help_text="The book in the source", max_length=255
            ),
        ),
        migrations.AddField(
            model_name="agentdescription",
            name="chapter",
            field=models.CharField(
                blank=True,
                help_text="The chapter or chapters in the source",
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name="agentdescription",
            name="page",
            field=models.CharField(
                blank=True,
                help_text="The page number or page range in the source",
                max_length=255,
            ),
        ),
        migrations.RunPython(
            code=migrate_source_location_to_page,
            reverse_code=migrate_page_to_source_location,
        ),
        migrations.RemoveField(
            model_name="agentdescription",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="agentdescriptiongender",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="agentdescriptionlocation",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="agentdescriptionname",
            name="source_location",
        ),
        migrations.RemoveField(
            model_name="agentdescriptionsocialstatus",
            name="source_location",
        ),
    ]