# Generated by Django 4.2.7 on 2024-03-01 12:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0005_person_is_group_alter_office_description_and_more'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Office',
            new_name='StatusMarker',
        ),
    ]