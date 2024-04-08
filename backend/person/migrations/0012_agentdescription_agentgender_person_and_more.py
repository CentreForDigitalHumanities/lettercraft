# Generated by Django 4.2.7 on 2024-04-08 13:50

import django.contrib.postgres.fields
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('source', '0004_delete_reference'),
        ('person', '0011_alter_agent_gender_alter_agent_is_group_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AgentDescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='a name to help identify this object', max_length=128)),
                ('description', models.TextField(blank=True, help_text='longer description to help identify this object')),
                ('location', models.CharField(blank=True, help_text='Specific location(s) where the entity is mentioned or described in the source text', max_length=200)),
                ('mention', models.CharField(blank=True, choices=[('direct', 'directly mentioned'), ('implied', 'implied')], help_text='How is the entity presented in the text?', max_length=32)),
                ('is_group', models.BooleanField(default=False, help_text="Whether this entity is a group of people (e.g. 'the nuns of Poitiers'). If true, the date of birth and date of death fields should be left empty.")),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AgentGender',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('mention', models.CharField(blank=True, choices=[('direct', 'directly mentioned'), ('implied', 'implied')], help_text='How is this information presented in the text?', max_length=32)),
                ('location', models.CharField(blank=True, help_text='Specific location of the information in the source text', max_length=200)),
                ('terminology', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, help_text='Relevant terminology used in the source text', size=5)),
                ('gender', models.CharField(choices=[('FEMALE', 'Female'), ('MALE', 'Male'), ('UNKNOWN', 'Unknown'), ('MIXED', 'Mixed'), ('OTHER', 'Other')], default='UNKNOWN', help_text="The gender of this person or group of people. The option Mixed is '             'only used for groups.", max_length=8)),
                ('agent', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='gender', to='person.agentdescription')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='a name to help identify this object', max_length=128)),
                ('description', models.TextField(blank=True, help_text='longer description to help identify this object')),
                ('identifiable', models.BooleanField(default=True, help_text='Whether this entity is identifiable, meaning they (or it) can be cross-referenced between sources')),
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
                ('person', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='date_of_birth', to='person.person')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PersonDateOfDeath',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('year_lower', models.IntegerField(default=400, help_text='The earliest possible year for this value', validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_upper', models.IntegerField(default=800, help_text='The latest possible year for this value', validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_exact', models.IntegerField(blank=True, help_text='The exact year of the value (if known). This will override the values in the lower and upper bounds fields.', null=True, validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('person', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='date_of_death', to='person.person')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PersonDescriptionReference',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('description', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='person.agentdescription')),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='person.person')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.RemoveField(
            model_name='agentdateofdeath',
            name='agent',
        ),
        migrations.AddField(
            model_name='agentname',
            name='location',
            field=models.CharField(blank=True, help_text='Specific location of the information in the source text', max_length=200),
        ),
        migrations.AddField(
            model_name='agentname',
            name='mention',
            field=models.CharField(blank=True, choices=[('direct', 'directly mentioned'), ('implied', 'implied')], help_text='How is this information presented in the text?', max_length=32),
        ),
        migrations.AddField(
            model_name='agentname',
            name='terminology',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, help_text='Relevant terminology used in the source text', size=5),
        ),
        migrations.AddField(
            model_name='socialstatus',
            name='location',
            field=models.CharField(blank=True, help_text='Specific location of the information in the source text', max_length=200),
        ),
        migrations.AddField(
            model_name='socialstatus',
            name='mention',
            field=models.CharField(blank=True, choices=[('direct', 'directly mentioned'), ('implied', 'implied')], help_text='How is this information presented in the text?', max_length=32),
        ),
        migrations.AddField(
            model_name='socialstatus',
            name='terminology',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, default=list, help_text='Relevant terminology used in the source text', size=5),
        ),
        migrations.DeleteModel(
            name='AgentDateOfBirth',
        ),
        migrations.DeleteModel(
            name='AgentDateOfDeath',
        ),
        migrations.AddField(
            model_name='agentdescription',
            name='describes',
            field=models.ManyToManyField(help_text='Historical individuals that this description refers to. If the agent is a group, this can be multiple individuals.', related_name='source_descriptions', through='person.PersonDescriptionReference', to='person.person'),
        ),
        migrations.AddField(
            model_name='agentdescription',
            name='source',
            field=models.ForeignKey(default='', help_text='The source in which this description occurs.', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
        migrations.AlterField(
            model_name='agentname',
            name='agent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='names', to='person.agentdescription'),
        ),
        migrations.AlterField(
            model_name='socialstatus',
            name='agent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='social_statuses', to='person.agentdescription'),
        ),
        migrations.DeleteModel(
            name='Agent',
        ),
    ]