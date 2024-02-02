# Generated by Django 4.2.7 on 2024-02-02 15:17

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0003_office_person_gender_occupation'),
    ]

    operations = [
        migrations.CreateModel(
            name='PersonDateOfDeath',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('year_lower', models.IntegerField(default=400, help_text='The earliest possible year for this value', validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_upper', models.IntegerField(default=800, help_text='The latest possible year for this value', validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_exact', models.IntegerField(blank=True, help_text='The exact year of the value (if known). This will override the values in the lower and upper bounds fields.', null=True, validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('person', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='person.person')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PersonDateOfBirth',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('year_lower', models.IntegerField(default=400, help_text='The earliest possible year for this value', validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_upper', models.IntegerField(default=800, help_text='The latest possible year for this value', validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_exact', models.IntegerField(blank=True, help_text='The exact year of the value (if known). This will override the values in the lower and upper bounds fields.', null=True, validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('person', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='person.person')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
