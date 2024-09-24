# Generated by Django 4.2.7 on 2024-08-07 13:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("event", "0022_episode_contributors"),
    ]

    operations = [
        migrations.AlterField(
            model_name="episode",
            name="categories",
            field=models.ManyToManyField(
                blank=True,
                help_text="labels assigned to this episode",
                related_name="episodes",
                to="event.episodecategory",
            ),
        ),
    ]