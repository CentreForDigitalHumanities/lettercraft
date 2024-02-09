# Generated by Django 4.2.7 on 2024-02-09 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('letter', '0007_gift'),
        ('event', '0004_alter_role_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='letteraction',
            name='gifts',
            field=models.ManyToManyField(help_text='Gifts associated to this letter action', related_name='letter_actions', to='letter.gift'),
        ),
    ]
