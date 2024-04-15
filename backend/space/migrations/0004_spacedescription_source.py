# Generated by Django 4.2.7 on 2024-04-09 10:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0004_delete_reference'),
        ('space', '0003_alter_ecclesiasticalregion_identifiable_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='spacedescription',
            name='source',
            field=models.ForeignKey(help_text='Source text containing this description', null=True, on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
    ]
