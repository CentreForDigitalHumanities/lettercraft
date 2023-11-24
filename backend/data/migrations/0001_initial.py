import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EpistolaryEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Letter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Role',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('present', models.BooleanField(default=True, help_text='Was this person physically present?')),
                ('role', models.CharField(choices=[('author', 'Author'), ('scribe', 'Scribe'), ('reader', 'Reader'), ('witness', 'Witness'), ('messenger', 'Messenger'), ('recipient', 'Recipient'), ('intended_recipient', 'Intended recipient'), ('audience', 'Audience'), ('intended_audience', 'Intended audience'), ('other', 'Other')])),
                ('description', models.TextField(help_text="Longer description of this person's involvement")),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data.epistolaryevent')),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='data.person')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PersonName',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('value', models.CharField(blank=True, max_length=256)),
                ('person', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='names', to='data.person', unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LetterMaterial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('surface', models.CharField(choices=[('parchment', 'parchment'), ('papyrus', 'papyrus'), ('other', 'other'), ('unknown', 'unknown')])),
                ('letter', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='data.letter')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='EpistolaryEventCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('value', models.CharField(choices=[('write', 'writing'), ('transport', 'transporting'), ('deliver', 'delivering'), ('read', 'reading'), ('sign', 'signing'), ('eat', 'eating')])),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='categories', to='data.epistolaryevent')),
            ],
        ),
        migrations.AddField(
            model_name='epistolaryevent',
            name='letters',
            field=models.ManyToManyField(related_name='events', to='data.letter'),
        ),
        migrations.AddConstraint(
            model_name='epistolaryeventcategory',
            constraint=models.UniqueConstraint(models.F('value'), models.F('event'), name='unique_categories_for_event'),
        ),
        migrations.AlterField(
            model_name='role',
            name='description',
            field=models.TextField(
                blank=True, help_text="Longer description of this person's involvement"),
        ),
        migrations.AddField(
            model_name='epistolaryevent',
            name='actors',
            field=models.ManyToManyField(
                related_name='events', through='data.Role', to='data.person'),
        ),
        migrations.AlterModelOptions(
            name='epistolaryeventcategory',
            options={'verbose_name_plural': 'epistolary event categories'},
        ),
        migrations.AlterField(
            model_name='epistolaryevent',
            name='letters',
            field=models.ManyToManyField(
                help_text='letters involved in this event', related_name='events', to='data.letter'),
        ),
        migrations.AlterField(
            model_name='epistolaryeventcategory',
            name='value',
            field=models.CharField(choices=[('write', 'writing'), ('transport', 'transporting'), ('deliver', 'delivering'), (
                'read', 'reading'), ('sign', 'signing'), ('eat', 'eating')], help_text='The type of event'),
        ),
        migrations.CreateModel(
            name='EpistolaryEventDate',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (
                    2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('year_exact', models.IntegerField(blank=True, help_text='The exact year of the event (if known)', null=True,
                 validators=[django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('event', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE,
                 related_name='date', to='data.epistolaryevent')),
                ('year_lower', models.IntegerField(default=400, help_text='The earliest possible year for the event', validators=[
                 django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
                ('year_upper', models.IntegerField(default=800, help_text='The latest possible year for the event', validators=[
                 django.core.validators.MinValueValidator(400), django.core.validators.MaxValueValidator(800)])),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AlterField(
            model_name='role',
            name='present',
            field=models.BooleanField(
                default=True, help_text='Whether this person was physically present'),
        ),
        migrations.AlterField(
            model_name='role',
            name='role',
            field=models.CharField(choices=[('author', 'Author'), ('scribe', 'Scribe'), ('reader', 'Reader'), ('witness', 'Witness'), ('messenger', 'Messenger'), ('recipient', 'Recipient'), (
                'intended_recipient', 'Intended recipient'), ('audience', 'Audience'), ('intended_audience', 'Intended audience'), ('other', 'Other')], help_text='Role of this person in the event'),
        ),
    ]
