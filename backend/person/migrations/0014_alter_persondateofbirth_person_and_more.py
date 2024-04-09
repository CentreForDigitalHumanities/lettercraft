# Generated by Django 4.2.7 on 2024-04-09 12:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0013_agentdescription_historicalperson_personreference_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='persondateofbirth',
            name='person',
            field=models.OneToOneField(help_text='date on which this person was born', on_delete=django.db.models.deletion.CASCADE, related_name='date_of_birth', to='person.historicalperson'),
        ),
        migrations.AlterField(
            model_name='persondateofdeath',
            name='person',
            field=models.OneToOneField(help_text='date on which this person died', on_delete=django.db.models.deletion.CASCADE, related_name='date_of_death', to='person.historicalperson'),
        ),
    ]
