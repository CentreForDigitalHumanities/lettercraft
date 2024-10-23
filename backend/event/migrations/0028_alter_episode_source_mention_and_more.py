# Generated by Django 4.2.7 on 2024-10-23 12:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0027_alter_episode_agents_alter_episode_gifts_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='episode',
            name='source_mention',
            field=models.CharField(blank=True, choices=[('direct', 'directly mentioned'), ('implied', 'implied'), ('up_for_debate', 'up for debate')], help_text='How is this entity presented in the text?', max_length=32),
        ),
        migrations.AlterField(
            model_name='episodeagent',
            name='source_mention',
            field=models.CharField(choices=[('direct', 'directly mentioned'), ('implied', 'implied'), ('up_for_debate', 'up for debate')], default='direct', help_text='How is this information presented in the text?', max_length=32),
        ),
        migrations.AlterField(
            model_name='episodegift',
            name='source_mention',
            field=models.CharField(choices=[('direct', 'directly mentioned'), ('implied', 'implied'), ('up_for_debate', 'up for debate')], default='direct', help_text='How is this information presented in the text?', max_length=32),
        ),
        migrations.AlterField(
            model_name='episodeletter',
            name='source_mention',
            field=models.CharField(choices=[('direct', 'directly mentioned'), ('implied', 'implied'), ('up_for_debate', 'up for debate')], default='direct', help_text='How is this information presented in the text?', max_length=32),
        ),
        migrations.AlterField(
            model_name='episodespace',
            name='source_mention',
            field=models.CharField(choices=[('direct', 'directly mentioned'), ('implied', 'implied'), ('up_for_debate', 'up for debate')], default='direct', help_text='How is this information presented in the text?', max_length=32),
        ),
    ]
