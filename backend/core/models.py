from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator, MaxValueValidator
from source.models import Source


class Field(models.Model):
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


class DescriptionField(Field, models.Model):
    """
    A piece of information in a source description
    """

    mention = models.CharField(
        max_length=32,
        blank=True,
        choices=[("direct", "directly mentioned"), ("implied", "implied")],
        help_text="How is this information presented in the text?",
    )
    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="Specific location of the information in the source text",
    )
    terminology = ArrayField(
        models.CharField(
            max_length=200,
        ),
        default=list,
        blank=True,
        size=5,
        help_text="Relevant terminology used in the source text",
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
    name = models.CharField(
        max_length=128, help_text="a name to help identify this object"
    )
    description = models.TextField(
        blank=True, help_text="longer description to help identify this object"
    )

    class Meta:
        abstract = True


class Historical(Named, models.Model):
    """
    An abstract model that represents a historical entity.

    These are typically connected to one or more SourceDescriptions.
    """

    identifiable = models.BooleanField(
        default=True,
        null=False,
        help_text="Whether this entity is identifiable, meaning they (or it) can be cross-referenced between sources",
    )

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class SourceDescription(Named, models.Model):
    """
    An abstract model of an entity (agent, object, space etc.) as it is described in a source.
    """

    source = models.ForeignKey(
        Source,
        default="",
        on_delete=models.CASCADE,
        help_text="The source in which this description occurs.",
    )
    location = models.CharField(
        max_length=200,
        blank=True,
        help_text="Specific location(s) where the entity is mentioned or described in the source text",
    )
    mention = models.CharField(
        max_length=32,
        blank=True,
        choices=[("direct", "directly mentioned"), ("implied", "implied")],
        help_text="How is the entity presented in the text?",
    )

    class Meta:
        abstract = True

    def __str__(self) -> str:
        return f"{self.name} ({self.source.name})"
