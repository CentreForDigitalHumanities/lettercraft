# Generated by Django 4.2.7 on 2024-02-28 17:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EcclesiasticalRegion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='EcclesiasticalRegionField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('ecclesiastical_region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.ecclesiasticalregion')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GeographicalRegion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GeographicalRegionField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('geographical_region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.geographicalregion')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PoliticalRegion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PoliticalRegionField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('political_region', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.politicalregion')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Settlement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, unique=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SettlementField',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('settlement', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.settlement')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SpaceDescription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='A name to identify this space when entering data', max_length=200)),
                ('description', models.TextField(blank=True, help_text='Longer description of this place that can be used to identify it')),
                ('ecclesiastical_regions', models.ManyToManyField(help_text='ecclesiastical regions referenced in this description', through='space.EcclesiasticalRegionField', to='space.ecclesiasticalregion')),
                ('geographical_regions', models.ManyToManyField(help_text='geographical regions referenced in this description', through='space.GeographicalRegionField', to='space.geographicalregion')),
                ('political_regions', models.ManyToManyField(help_text='political regions referenced in this description', through='space.PoliticalRegionField', to='space.politicalregion')),
                ('settlements', models.ManyToManyField(help_text='settlements referenced in this description', through='space.SettlementField', to='space.settlement')),
            ],
        ),
        migrations.CreateModel(
            name='Spot',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('spot', models.CharField(max_length=512)),
                ('space', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='spots', to='space.spacedescription')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='settlementfield',
            name='space',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.spacedescription'),
        ),
        migrations.AddField(
            model_name='politicalregionfield',
            name='space',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.spacedescription'),
        ),
        migrations.CreateModel(
            name='LandscapeFeature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('certainty', models.IntegerField(choices=[(0, 'uncertain'), (1, 'somewhat certain'), (2, 'certain')], default=2, help_text='How certain are you of this value?')),
                ('note', models.TextField(blank=True, help_text='Additional notes')),
                ('landscape', models.CharField(max_length=512)),
                ('space', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='landscape_features', to='space.spacedescription')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='geographicalregionfield',
            name='space',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.spacedescription'),
        ),
        migrations.AddField(
            model_name='ecclesiasticalregionfield',
            name='space',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='space.spacedescription'),
        ),
    ]
