# Generated by Django 4.2.7 on 2024-04-08 12:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('letter', '0009_giftaddressee_giftdescription_giftmaterial_and_more'),
        ('event', '0012_eventdescriptionagent_agent_and_more'),
        ('source', '0004_delete_reference'),
        ('person', '0012_agentdescription_agentgender_person_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='preservedletterrole',
            name='person',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='person.person'),
        ),
        migrations.AddField(
            model_name='lettersender',
            name='agent',
            field=models.ForeignKey(help_text='agent described as a sender of the letter', on_delete=django.db.models.deletion.CASCADE, to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='lettersender',
            name='letter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='letter.letterdescription'),
        ),
        migrations.AddField(
            model_name='letterdescription',
            name='source',
            field=models.ForeignKey(default='', help_text='The source in which this description occurs.', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
        migrations.AddField(
            model_name='letteraddressee',
            name='agent',
            field=models.ForeignKey(help_text='agent described as an addressee of the letter', on_delete=django.db.models.deletion.CASCADE, to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='letteraddressee',
            name='letter',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='letter.letterdescription'),
        ),
        migrations.AddField(
            model_name='giftsender',
            name='agent',
            field=models.ForeignKey(help_text='agent described as a sender of the gift', on_delete=django.db.models.deletion.CASCADE, to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='giftsender',
            name='gift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='letter.giftdescription'),
        ),
        migrations.AddField(
            model_name='giftmaterial',
            name='gift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materials', to='letter.giftdescription'),
        ),
        migrations.AddField(
            model_name='giftdescription',
            name='gifted_by',
            field=models.ForeignKey(blank=True, help_text='The agent who gave the gift. Leave empty if unknown.', null=True, on_delete=django.db.models.deletion.CASCADE, related_name='gifts_given', to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='giftdescription',
            name='source',
            field=models.ForeignKey(default='', help_text='The source in which this description occurs.', on_delete=django.db.models.deletion.CASCADE, to='source.source'),
        ),
        migrations.AddField(
            model_name='giftaddressee',
            name='agent',
            field=models.ForeignKey(help_text='agent described as an addressee of the gift', on_delete=django.db.models.deletion.CASCADE, to='person.agentdescription'),
        ),
        migrations.AddField(
            model_name='giftaddressee',
            name='gift',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='letter.giftdescription'),
        ),
        migrations.AlterField(
            model_name='lettercategory',
            name='letter',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='letter.letterdescription'),
        ),
        migrations.AlterField(
            model_name='lettermaterial',
            name='letter',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='letter.letterdescription'),
        ),
        migrations.DeleteModel(
            name='Letter',
        ),
    ]
