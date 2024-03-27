# Generated by Django 4.2.7 on 2024-03-27 20:07

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("source", "0004_delete_reference"),
        ("person", "0011_alter_agent_gender_alter_agent_is_group_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="AgentBase",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "gender",
                    models.CharField(
                        choices=[
                            ("FEMALE", "Female"),
                            ("MALE", "Male"),
                            ("UNKNOWN", "Unknown"),
                            ("MIXED", "Mixed"),
                            ("OTHER", "Other"),
                        ],
                        default="UNKNOWN",
                        help_text="The gender of this person or group of people. The option Mixed is only used for groups.",
                        max_length=8,
                    ),
                ),
                (
                    "is_group",
                    models.BooleanField(
                        default=False,
                        help_text="Whether this entity is a group of people (e.g. 'the nuns of Poitiers'). If true, the date of birth and date of death fields should be left empty.",
                    ),
                ),
            ],
        ),
        migrations.RemoveConstraint(
            model_name="agent",
            name="gender_group_constraint",
        ),
        migrations.RemoveField(
            model_name="agent",
            name="gender",
        ),
        migrations.RemoveField(
            model_name="agent",
            name="id",
        ),
        migrations.RemoveField(
            model_name="agent",
            name="is_group",
        ),
        migrations.CreateModel(
            name="AgentDescription",
            fields=[
                (
                    "agentbase_ptr",
                    models.OneToOneField(
                        auto_created=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        parent_link=True,
                        primary_key=True,
                        serialize=False,
                        to="person.agentbase",
                    ),
                ),
                (
                    "location",
                    models.CharField(
                        blank=True,
                        help_text="Specific location of the reference in the source text",
                        max_length=200,
                    ),
                ),
                (
                    "terminology",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(max_length=200),
                        blank=True,
                        default=list,
                        help_text="Terminology used in the source text to describe this entity",
                        size=5,
                    ),
                ),
                (
                    "mention",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("direct", "directly mentioned"),
                            ("implied", "implied"),
                        ],
                        help_text="How is this information presented in the text?",
                        max_length=32,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
            bases=("person.agentbase", models.Model),
        ),
        migrations.AddConstraint(
            model_name="agentbase",
            constraint=models.CheckConstraint(
                check=models.Q(("gender", "MIXED"), ("is_group", True), _negated=True),
                name="gender_group_constraint",
                violation_error_message="The 'mixed' gender option is reserved for groups",
            ),
        ),
        migrations.AddField(
            model_name="agent",
            name="agentbase_ptr",
            field=models.OneToOneField(
                auto_created=True,
                default=1,
                on_delete=django.db.models.deletion.CASCADE,
                parent_link=True,
                primary_key=True,
                serialize=False,
                to="person.agentbase",
            ),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="agentdateofbirth",
            name="agent",
            field=models.OneToOneField(
                limit_choices_to={"is_group": False},
                on_delete=django.db.models.deletion.CASCADE,
                related_name="date_of_birth",
                to="person.agentbase",
            ),
        ),
        migrations.AlterField(
            model_name="agentdateofdeath",
            name="agent",
            field=models.OneToOneField(
                limit_choices_to={"is_group": False},
                on_delete=django.db.models.deletion.CASCADE,
                related_name="date_of_death",
                to="person.agentbase",
            ),
        ),
        migrations.AlterField(
            model_name="agentname",
            name="agent",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="names",
                to="person.agentbase",
            ),
        ),
        migrations.AlterField(
            model_name="socialstatus",
            name="agent",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="social_statuses",
                to="person.agentbase",
            ),
        ),
        migrations.AddField(
            model_name="agentdescription",
            name="source",
            field=models.ForeignKey(
                help_text="The source in which this description occurs.",
                on_delete=django.db.models.deletion.CASCADE,
                to="source.source",
            ),
        ),
        migrations.AddField(
            model_name="agentdescription",
            name="target",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="source_descriptions",
                to="person.agent",
            ),
        ),
    ]
