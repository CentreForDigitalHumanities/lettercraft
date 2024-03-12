# Generated by Django 4.2.7 on 2024-03-01 12:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0007_rename_occupation_socialstatus_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='socialstatus',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_statuses', to='person.person'),
        ),
        migrations.AlterField(
            model_name='socialstatus',
            name='status_marker',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_statuses', to='person.statusmarker'),
        ),
        migrations.AlterModelOptions(
            name='socialstatus',
            options={'verbose_name_plural': 'Social statuses'},
        ),
    ]