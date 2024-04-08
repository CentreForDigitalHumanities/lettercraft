# Generated by Django 4.2.7 on 2024-04-08 12:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0011_eventdescriptionletter_letter_and_more'),
        ('source', '0004_delete_reference'),
        ('letter', '0009_giftaddressee_giftdescription_giftmaterial_and_more'),
        ('person', '0012_agentdescription_agentgender_person_and_more'),
        ('space', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventdescriptionagent',
            name='agent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='eventdescriptionagent',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='event.eventdescription'),
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='actors',
            field=models.ManyToManyField(help_text='agents involved in this event', related_name='events', through='event.EventDescriptionAgent', to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='gifts',
            field=models.ManyToManyField(help_text='gifts involved in this event', related_name='events', to='letter.giftdescription'),
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='letters',
            field=models.ManyToManyField(help_text='letters involved in this event', related_name='events', to='letter.letterdescription'),
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='source',
            field=models.ForeignKey(default='', help_text='The source in which this description occurs.', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='spaces',
            field=models.ManyToManyField(help_text='spaces involved in this event', related_name='events', to='space.spacedescription'),
        ),
    ]
