# Generated by Django 4.2.7 on 2024-10-01 13:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_sitedomain'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_contributor',
            field=models.BooleanField(default=False, help_text='Whether this user is a contributor on the project; this enables them to enter or edit research data.'),
        ),
    ]
