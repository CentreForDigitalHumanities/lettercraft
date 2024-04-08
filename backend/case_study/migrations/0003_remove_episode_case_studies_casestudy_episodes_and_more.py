# Generated by Django 4.2.7 on 2024-04-08 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0013_alter_agentdescription_source'),
        ('space', '0003_landscapefeature_location_landscapefeature_mention_and_more'),
        ('event', '0013_alter_eventdescription_source_and_more'),
        ('case_study', '0002_casestudy_description_alter_casestudy_name_episode'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='episode',
            name='case_studies',
        ),
        migrations.AddField(
            model_name='casestudy',
            name='episodes',
            field=models.ManyToManyField(blank=True, help_text='episodes that are part of this case study', related_name='case_studies', to='case_study.episode'),
        ),
        migrations.AddField(
            model_name='casestudy',
            name='key_figures',
            field=models.ManyToManyField(blank=True, help_text='historical figures central to this case study', limit_choices_to={'identifiable': True}, related_name='case_studies', to='person.person'),
        ),
        migrations.AddField(
            model_name='casestudy',
            name='key_sites',
            field=models.ManyToManyField(blank=True, help_text='historical sites central to this case study', limit_choices_to={'identifiable': True}, related_name='case_studies', to='space.structure'),
        ),
        migrations.AddField(
            model_name='episode',
            name='event_descriptions',
            field=models.ManyToManyField(blank=True, related_name='episodes', to='event.eventdescription'),
        ),
    ]
