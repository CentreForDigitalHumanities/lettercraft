# Generated by Django 4.2.7 on 2024-04-18 11:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0013_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='A name to help identify this object', max_length=200)),
                ('description', models.TextField(blank=True, help_text='Longer description to help identify this object')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='summary',
            field=models.TextField(blank=True, help_text='full description of the events in the passage'),
        ),
        migrations.AddField(
            model_name='eventdescription',
            name='categories',
            field=models.ManyToManyField(help_text='labels assigned to this event', related_name='event_descriptions', to='event.eventcategory'),
        ),
    ]
