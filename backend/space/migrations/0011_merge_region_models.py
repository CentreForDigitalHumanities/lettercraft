# Generated by Django 4.2.7 on 2024-06-20 11:05

from django.db import migrations, models
import django.db.models.deletion


def region_submodels(apps):
    """
    Lists the pre-migration models for regions (political, ecclesiastical, geographical)
    """

    return [
        (
            apps.get_model("space", "PoliticalRegion"),
            "political",
            apps.get_model("space", "PoliticalRegionField"),
            "political_region",
        ),
        (
            apps.get_model("space", "EcclesiasticalRegion"),
            "ecclesiastical",
            apps.get_model("space", "EcclesiasticalRegionField"),
            "ecclesiastical_region",
        ),
        (
            apps.get_model("space", "GeographicalRegion"),
            "geographical",
            apps.get_model("space", "GeographicalRegionField"),
            "geographical_region",
        ),
    ]


def copy_subregions_to_region(apps, schema_editor):
    Region = apps.get_model("space", "Region")
    RegionField = apps.get_model("space", "RegionField")

    submodels = region_submodels(apps)

    for Model, region_type, FieldModel, field_property in submodels:
        for obj in Model.objects.all():
            region = Region.objects.create(
                name=obj.name,
                description=obj.description,
                identifiable=obj.identifiable,
                type=region_type,
            )
            for relation in FieldModel.objects.filter(**{field_property: obj}):
                RegionField.objects.create(
                    space=relation.space,
                    region=region,
                    source_mention=relation.source_mention,
                    note=relation.note,
                )


def copy_region_to_subregions(apps, schema_editor):
    Region = apps.get_model("space", "Region")
    RegionField = apps.get_model("space", "RegionField")

    submodels = region_submodels(apps)

    for Model, region_type, FieldModel, field_property in submodels:
        for region in Region.objects.filter(type=region_type):
            obj = Model.object.create(
                name=region.name,
                description=region.description,
                identifiable=region.identifiable,
            )
            for relation in RegionField.object.filter(region=region):
                FieldModel.objects.create(
                    space=relation.space,
                    source_mention=relation.source_mention,
                    note=relation.note,
                    **{field_property: obj},
                )


class Migration(migrations.Migration):

    dependencies = [
        ("space", "0010_remove_ecclesiasticalregionfield_source_terminology_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="Region",
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
                    "name",
                    models.CharField(
                        help_text="A name to help identify this object", max_length=200
                    ),
                ),
                (
                    "description",
                    models.TextField(
                        blank=True,
                        help_text="Longer description to help identify this object",
                    ),
                ),
                (
                    "identifiable",
                    models.BooleanField(
                        default=True,
                        help_text="Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[
                            ("political", "political"),
                            ("ecclesiastical", "ecclesiastical"),
                            ("geographical", "geographical"),
                        ],
                        help_text="Kind of region",
                        max_length=32,
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.CreateModel(
            name="RegionField",
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
                    "certainty",
                    models.IntegerField(
                        choices=[
                            (0, "uncertain"),
                            (1, "somewhat certain"),
                            (2, "certain"),
                        ],
                        default=2,
                        help_text="How certain are you of this value?",
                    ),
                ),
                ("note", models.TextField(blank=True, help_text="Additional notes")),
                (
                    "source_mention",
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
                (
                    "region",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="space.region"
                    ),
                ),
                (
                    "space",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="space.spacedescription",
                    ),
                ),
            ],
            options={
                "abstract": False,
            },
        ),
        migrations.AddField(
            model_name="spacedescription",
            name="regions",
            field=models.ManyToManyField(
                help_text="Regions referenced in this description",
                through="space.RegionField",
                to="space.region",
            ),
        ),
        migrations.RunPython(
            copy_subregions_to_region,
            reverse_code=copy_region_to_subregions,
        ),
        migrations.RemoveField(
            model_name="ecclesiasticalregionfield",
            name="ecclesiastical_region",
        ),
        migrations.RemoveField(
            model_name="ecclesiasticalregionfield",
            name="space",
        ),
        migrations.RemoveField(
            model_name="geographicalregionfield",
            name="geographical_region",
        ),
        migrations.RemoveField(
            model_name="geographicalregionfield",
            name="space",
        ),
        migrations.RemoveField(
            model_name="politicalregionfield",
            name="political_region",
        ),
        migrations.RemoveField(
            model_name="politicalregionfield",
            name="space",
        ),
        migrations.RemoveField(
            model_name="spacedescription",
            name="ecclesiastical_regions",
        ),
        migrations.RemoveField(
            model_name="spacedescription",
            name="geographical_regions",
        ),
        migrations.RemoveField(
            model_name="spacedescription",
            name="political_regions",
        ),
        migrations.DeleteModel(
            name="EcclesiasticalRegion",
        ),
        migrations.DeleteModel(
            name="EcclesiasticalRegionField",
        ),
        migrations.DeleteModel(
            name="GeographicalRegion",
        ),
        migrations.DeleteModel(
            name="GeographicalRegionField",
        ),
        migrations.DeleteModel(
            name="PoliticalRegion",
        ),
        migrations.DeleteModel(
            name="PoliticalRegionField",
        ),
    ]