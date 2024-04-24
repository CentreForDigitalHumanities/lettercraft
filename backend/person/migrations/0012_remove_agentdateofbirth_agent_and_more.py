# Generated by Django 4.2.7 on 2024-04-09 10:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0010_remove_letteraction_actors_delete_role'),
        ('letter', '0009_remove_lettersenders_letter_and_more'),
        ('person', '0011_alter_agent_gender_alter_agent_is_group_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='agentdateofbirth',
            name='agent',
        ),
        migrations.RemoveField(
            model_name='agentdateofdeath',
            name='agent',
        ),
        migrations.RemoveField(
            model_name='agentname',
            name='agent',
        ),
        migrations.RemoveField(
            model_name='socialstatus',
            name='agent',
        ),
        migrations.RemoveField(
            model_name='socialstatus',
            name='status_marker',
        ),
        migrations.DeleteModel(
            name='Agent',
        ),
        migrations.DeleteModel(
            name='AgentDateOfBirth',
        ),
        migrations.DeleteModel(
            name='AgentDateOfDeath',
        ),
        migrations.DeleteModel(
            name='AgentName',
        ),
        migrations.DeleteModel(
            name='SocialStatus',
        ),
    ]
