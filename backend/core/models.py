from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from user.models import User


class Certainty(models.IntegerChoices):
    UNCERTAIN = (0, "uncertain")
    SOMEWHAT_CERTAIN = (1, "somewhat certain")
    CERTAIN = (2, "certain")


class Field(models.Model):
    """
    A piece of information about an entity.
    """

    certainty = models.IntegerField(
        choices=Certainty.choices,
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
    def display_date(self) -> str:
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
        help_text="A name to help identify this object",
    )
    description = models.TextField(
        blank=True,
        help_text="Longer description to help identify this object",
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

    contributors = models.ManyToManyField(
        to=User,
        blank=True,
        help_text="Users who contributed to this entry",
    )

    class Meta:
        abstract = True


class SourceMention(models.TextChoices):
    DIRECT = "direct", "directly mentioned"
    IMPLIED = "implied", "implied"


class EntityDescription(Named, models.Model):
    """
    A description of an entity (person, object, location, episode) in a narrative source.

    Descriptions may refer to HistoricalEntity targets.
    """

    source = models.ForeignKey(
        to="source.Source",
        on_delete=models.PROTECT,
        help_text="Source text containing this description",
    )

    source_mention = models.CharField(
        max_length=32,
        blank=True,
        choices=SourceMention.choices,
        help_text="How is this entity presented in the text?",
    )

    book = models.CharField(
        max_length=255,
        blank=True,
        help_text="The book in the source",
    )

    chapter = models.CharField(
        max_length=255,
        blank=True,
        help_text="The chapter or chapters in the source",
    )

    page = models.CharField(
        max_length=255,
        blank=True,
        help_text="The page number or page range in the source",
    )

    contributors = models.ManyToManyField(
        to=User,
        blank=True,
        help_text="Users who contributed to this entry",
    )

    class Meta:
        abstract = True

    def __str__(self):
        return f"{self.name} ({self.source})"


class DescriptionField(Field, models.Model):
    """
    A piece of information contained in an EntityDescription.

    An extension of Field that can contain extra information about how and where the
    information is presented in the source.
    """

    source_mention = models.CharField(
        max_length=32,
        blank=False,
        choices=SourceMention.choices,
        default=SourceMention.DIRECT,
        help_text="How is this information presented in the text?",
    )

    class Meta:
        abstract = True
