# Generated by Django 4.2.7 on 2024-04-08 14:13

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0004_delete_reference'),
        ('space', '0002_ecclesiasticalregionfield_location_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='landscapefeature',
            name='location',
            field=models.CharField(blank=True, help_text='Specific location of the information in the source text', max_length=200),
        ),
        migrations.AddField(
            model_name='landscapefeature',
            name='mention',
            field=models.CharField(blank=True, choices=[('direct', 'directly mentioned'), ('implied', 'implied')], help_text='How is this information presented in the text?', max_length=32),
        ),
        migrations.AddField(
            model_name='landscapefeature',
            name='terminology',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, help_text='Relevant terminology used in the source text', size=5),
        ),
        migrations.AlterField(
            model_name='spacedescription',
            name='source',
            field=models.ForeignKey(help_text='The source in which this description occurs.', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
    ]
