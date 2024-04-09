from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from source.models import Source

class Field(models.Model):
    """
    A piece of information about an entity.
    """

    certainty = models.IntegerField(
        choices=[
            (0, "uncertain"),
            (1, "somewhat certain"),
            (2, "certain"),
        ],
        default=2,
        help_text="How certain are you of this value?",
    )

    note = models.TextField(
        null=False,
        blank=True,
        help_text="Additional notes",
    )

    class Meta:
        abstract = True


class LettercraftDate(models.Model):
    MIN_YEAR = 400
    MAX_YEAR = 800

    year_lower = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MIN_YEAR,
        help_text="The earliest possible year for this value",
    )

    year_upper = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MAX_YEAR,
        help_text="The latest possible year for this value",
    )

    year_exact = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        help_text="The exact year of the value (if known). This will override the values in the lower and upper bounds fields.",
    )

    @property
    def display_date(self):
        if self.year_exact:
            return str(self.year_exact)
        return f"c. {self.year_lower}–{self.year_upper}"

    class Meta:
        abstract = True

    def clean(self):
        if self.year_exact:
            self.year_lower = self.year_exact
            self.year_upper = self.year_exact


class Named(models.Model):
    """
    An object with a name and description
    """

    name = models.CharField(
        max_length=200,
        blank=False,
        help_text="A name to identify this space when entering data",
    )
    description = models.TextField(
        blank=True,
    )

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class HistoricalEntity(Named, models.Model):

    identifiable = models.BooleanField(
        default=True,
        null=False,
        help_text="Whether this entity is identifiable (i.e. can be cross-referenced between descriptions), or a generic description",
    )

    class Meta:
        abstract = True


class EntityDescription(Named, models.Model):
    """
    A description of an entity (person, object, location, event) in a narrative source.

    Descriptions may refer to HistoricalEntity targets.
    """

    source = models.ForeignKey(
        to=Source,
        null=True,
        on_delete=models.CASCADE,
        help_text="Source text containing this description",
    )

    class Meta:
        abstract = True


class DescriptionField(Field, models.Model):
    """
    A piece of information contained in an EntityDescription.

    An extension of Field that can contain extra information about how and where the
    information is presented in the source.
    """

    class Meta:
        abstract = True
