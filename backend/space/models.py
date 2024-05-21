from django.db import models
from django.contrib import admin
import itertools

from core.models import DescriptionField, HistoricalEntity, EntityDescription
from space import validators


class SpaceDescription(EntityDescription, models.Model):
    """
    The representation of a space within a source text.

    This model compounds all different aspects of space (geographical, political, etc.).
    """

    political_regions = models.ManyToManyField(
        to="PoliticalRegion",
        through="PoliticalRegionField",
        help_text="Political regions referenced in this description",
    )

    ecclesiastical_regions = models.ManyToManyField(
        to="EcclesiasticalRegion",
        through="EcclesiasticalRegionField",
        help_text="Ecclesiastical regions referenced in this description",
    )

    geographical_regions = models.ManyToManyField(
        to="GeographicalRegion",
        through="GeographicalRegionField",
        help_text="Geographical regions referenced in this description",
    )

    structures = models.ManyToManyField(
        to="Structure",
        through="StructureField",
        help_text="Man-made structures referenced in this description",
    )


class PoliticalRegion(HistoricalEntity, models.Model):
    """
    A political region, e.g. a kingdom or duchy
    """

    pass


class EcclesiasticalRegion(HistoricalEntity, models.Model):
    """
    An ecclesiastical region, e.g. a diocese
    """

    pass


class GeographicalRegion(HistoricalEntity, models.Model):
    """
    A geographical region or location, e.g. "the Pyrenees".
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
        SETTLEMENT = 0, "settlement, population centre"
        ROAD = 1, "road, square, crossroad"
        FORTIFICATION = 2, "fortification"
        BUILDING = 3, "building, vessel"
        ROOM = 4, "room"
        SPOT = 5, "spot, object"

    level = models.IntegerField(choices=LevelOptions.choices)
    parent = models.ForeignKey(
        to="self",
        related_name="children",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name="parent structure",
        help_text="The structure containing this structure, e.g. the building containing a room.",
    )

    @property
    def ancestors(self):
        if self.parent:
            return [self.parent] + self.parent.ancestors
        else:
            return []

    @admin.display(description="Contained in structures")
    def ancestors_display(self):
        return ", ".join(str(a) for a in self.ancestors)

    @property
    def descendants(self):
        iterate_descendants = (
            [child] + child.descendants for child in self.children.all()
        )
        return list(itertools.chain.from_iterable(iterate_descendants))

    @admin.display(description="Contains structures")
    def descendants_display(self):
        return ", ".join(str(a) for a in self.descendants)

    def clean(self):
        if self.parent:
            validators.validate_level_deeper_than_parent(
                self.level, self.parent, self.LevelOptions
            )


class PoliticalRegionField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    political_region = models.ForeignKey(to=PoliticalRegion, on_delete=models.CASCADE)


class EcclesiasticalRegionField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    ecclesiastical_region = models.ForeignKey(
        to=EcclesiasticalRegion, on_delete=models.CASCADE
    )


class GeographicalRegionField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    geographical_region = models.ForeignKey(
        to=GeographicalRegion, on_delete=models.CASCADE
    )


class StructureField(DescriptionField, models.Model):
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)
    structure = models.ForeignKey(to=Structure, on_delete=models.CASCADE)


class LandscapeFeature(DescriptionField, models.Model):
    """
    A landscape feature describes natural or geological aspects of a
    space, e.g. "a forest", "a hill", "a cave".
    """

    space = models.ForeignKey(
        to=SpaceDescription, on_delete=models.CASCADE, related_name="landscape_features"
    )
    landscape = models.CharField(max_length=512, blank=False)
