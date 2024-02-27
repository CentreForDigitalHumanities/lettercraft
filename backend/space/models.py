from django.db import models

from core.models import Field


class SpaceDescription(models.Model):
    """
    The representation of a space within a source text.

    This model compounds all different aspects of space (geographical, political, etc.).
    """

    name = models.CharField(
        max_length=200,
        blank=False,
        help_text="A name to identify this space when entering data",
    )

    def __str__(self):
        return self.name


class NamedSpace(models.Model):
    """
    Abstract class for "Named" regions, i.e. ones that can be
    identified as named entities.
    """

    name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
    )

    # may be expanded with geo data?

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class PoliticalRegion(NamedSpace, models.Model):
    """
    A political region, e.g. a kingdom or duchy
    """

    pass


class EcclesiasticalRegion(NamedSpace, models.Model):
    """
    An ecclesiastical region, e.g. a dioceses
    """

    pass


class GeographicalRegion(NamedSpace, models.Model):
    """
    A geographical region or location.

    Unlike political or ecclesiastical regions, geographic locations
    may be recognised today, e.g. "the Pyrenees".
    """

    pass


class Settlement(NamedSpace, models.Model):
    """
    A settlement is a population centre or fortification, e.g. "Poitiers",
    "monastery of Tolouse", or "a village"
    """

    pass


class PoliticalRegionField(Field, models.Model):
    political_region = models.ForeignKey(to=PoliticalRegion, on_delete=models.CASCADE)
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)


class EcceclesiasticalRegionField(Field, models.Model):
    ecclesiastical_region = models.ForeignKey(
        to=EcclesiasticalRegion, on_delete=models.CASCADE
    )
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)


class GeographicalRegionField(Field, models.Model):
    geographical_region = models.ForeignKey(
        to=GeographicalRegion, on_delete=models.CASCADE
    )
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)


class SettlementField(Field, models.Model):
    settlement = models.ForeignKey(to=Settlement, on_delete=models.CASCADE)
    space = models.ForeignKey(to=SpaceDescription, on_delete=models.CASCADE)


class LandscapeFeature(Field, models.Model):
    """
    A landscape feature describes natural or geological aspects of a
    space, e.g. "a forest", "a hill", "a cave".
    """

    description = models.CharField(max_length=512, blank=False)


class Spot(Field, models.Model):
    """
    A spot provides detail about the precise location, e.g. a room or a road.

    It is purely descriptive, and captures information too detailed to enter
    as a "named region".

    Spots are distinct from landscape features in that they usually describe
    architectural features rather than natural ones.
    """

    description = models.CharField(max_length=512, blank=False)
