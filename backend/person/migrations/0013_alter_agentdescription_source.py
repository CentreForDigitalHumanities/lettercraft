# Generated by Django 4.2.7 on 2024-04-08 14:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0004_delete_reference'),
        ('person', '0012_agentdescription_agentgender_person_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agentdescription',
            name='source',
            field=models.ForeignKey(help_text='The source in which this description occurs.', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
    ]