# Generated by Django 4.2.7 on 2024-02-09 14:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0004_persondateofdeath_persondateofbirth'),
        ('letter', '0006_lettersenders_letteraddressees'),
    ]

    operations = [
        migrations.CreateModel(
            name='Gift',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='A short name for the gift (for identification)', max_length=256)),
                ('description', models.TextField(blank=True, help_text='A longer description of the gift')),
                ('material', models.CharField(choices=[('precious metal', 'precious metal'), ('textile', 'textile'), ('wood', 'wood'), ('glass', 'glass'), ('ceramic', 'ceramic'), ('animal product', 'animal product'), ('livestock', 'livestock'), ('paper', 'paper'), ('other', 'other'), ('unknown', 'unknown')], help_text='The material the gift consists of')),
                ('gifted_by', models.ForeignKey(help_text='The person who gave the gift. Leave empty if unknown.', null=True, blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='gifts_given', to='person.person')),
            ],
        ),
    ]
