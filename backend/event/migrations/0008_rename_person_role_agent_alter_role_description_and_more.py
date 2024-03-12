# Generated by Django 4.2.7 on 2024-03-01 15:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0007_alter_letteraction_gifts'),
    ]

    operations = [
        migrations.RenameField(
            model_name='role',
            old_name='person',
            new_name='agent',
        ),
        migrations.AlterField(
            model_name='role',
            name='description',
            field=models.TextField(blank=True, help_text="Longer description of this agent's involvement"),
        ),
        migrations.AlterField(
            model_name='role',
            name='present',
            field=models.BooleanField(default=True, help_text='Whether this agent was physically present'),
        ),
        migrations.AlterField(
            model_name='role',
            name='role',
            field=models.CharField(choices=[('author', 'Author'), ('scribe', 'Scribe'), ('reader', 'Reader'), ('witness', 'Witness'), ('messenger', 'Messenger'), ('recipient', 'Recipient'), ('intended_recipient', 'Intended recipient'), ('audience', 'Audience'), ('intended_audience', 'Intended audience'), ('instigator', 'Instigator'), ('other', 'Other')], help_text='Role of this agent in the event'),
        ),
    ]