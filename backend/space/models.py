from django.db import models

from core.models import DescriptionField, HistoricalEntity, EntityDescription


class SpaceDescription(EntityDescription, models.Model):
    """
    The representation of a space within a source text.

    This model compounds all different aspects of space (geographical, political, etc.).
    """

    regions = models.ManyToManyField(
        to="Region",
        through="RegionField",
        help_text="Regions referenced in this description",
    )

    settlements = models.ManyToManyField(
        to="Settlement",
        through="SettlementField",
        help_text="Settlements referenced in this description",
    )

    structures = models.ManyToManyField(
        to="Structure",
        through="StructureField",
        help_text="Man-made structures referenced in this description",
    )


class Region(HistoricalEntity, models.Model):
    """
    A region. Regions can be political (e.g. kingdoms), ecclesiastical (e.g. dioceses), or
    geographical (e.g. a mountain range).
    """

    type = models.CharField(
        max_length=32,
        choices=[
            ("political", "political"),
            ("ecclesiastical", "ecclesiastical"),
            ("geographical", "geographical"),
        ],
        help_text="Kind of region",
    )


class Settlement(HistoricalEntity, models.Model):
    """
    A town or village.
    """

    pass


class Structure(HistoricalEntity, models.Model):
    """
    A structure is a man-made site.

    This can be a population centre ("Poitiers"), fortification
    ("the monastery of Toulouse"), building ("a church"), room,
    road, or even a specific object ("a desk").
    """

    class LevelOptions(models.IntegerChoices):
        ROAD = 1, "road, square, crossroad"
        FORTIFICATION = 2, "fortification"
        BUILDING = 3, "building, vessel"
        ROOM = 4, "room"
        SPOT = 5, "spot, object"

    settlement = models.ForeignKey(
        to=Settlement,
        related_name="structures",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        help_text="The settlement containing this structure",
    )

    level = models.IntegerField(choices=LevelOptions.choices)

class RegionField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    region = models.ForeignKey(to=Region, on_delete=models.CASCADE)


class SettlementField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    settlement = models.ForeignKey(to=Settlement, on_delete=models.CASCADE)


class StructureField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    structure = models.ForeignKey(to=Structure, on_delete=models.CASCADE)
