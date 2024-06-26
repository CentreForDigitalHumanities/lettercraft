# Generated by Django 4.2.7 on 2024-04-09 11:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0005_placeholder_source'),
        ('space', '0005_fill_in_placeholder_source'),
    ]

    operations = [
        migrations.AlterField(
            model_name='spacedescription',
            name='source',
            field=models.ForeignKey(help_text='Source text containing this description', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
    ]
