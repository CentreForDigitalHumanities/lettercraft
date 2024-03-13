from django.db import models
from django.contrib import admin
from core.models import Field
from person.models import Agent


class Gift(models.Model):
    """
    A gift presented alongside a letter.
    """

    class Material(models.TextChoices):
        PRECIOUS_METAL = "precious metal", "precious metal"
        WRITE = "textile", "textile"
        WOOD = "wood", "wood"
        GLASS = "glass", "glass"
        CERAMIC = "ceramic", "ceramic"
        ANIMAL_PRODUCT = "animal product", "animal product"
        LIVESTOCK = "livestock", "livestock"
        PAPER = "paper", "paper"
        OTHER = "other", "other"
        UNKNOWN = "unknown", "unknown"

    name = models.CharField(
        max_length=256, help_text="A short name for the gift (for identification)"
    )

    description = models.TextField(
        blank=True,
        help_text="A longer description of the gift",
    )

    material = models.CharField(
        choices=Material.choices,
        help_text="The material the gift consists of",
    )

    gifted_by = models.ForeignKey(
        to=Agent,
        on_delete=models.CASCADE,
        related_name="gifts_given",
        help_text="The agent who gave the gift. Leave empty if unknown.",
        null=True,
        blank=True,
    )

    def __str__(self):
        gifter_name = (
            self.gifted_by.names.first() if self.gifted_by is not None else "unknown"
        )
        return f"{self.name} ({self.material}), gifted by {gifter_name}"


class Letter(models.Model):
    name = models.CharField(
        max_length=200,
        blank=False,
        unique=True,
        help_text="a unique name to identify this letter in the database",
    )

    def __str__(self):
        return self.name

    @admin.display(
        description="Date range of actions involving this letter",
    )
    def date_active(self):
        return self._aggregate_dates(self.events.all())

    @admin.display(
        description="Date range in which this letter was written",
    )
    def date_written(self):
        return self._aggregate_dates(self.events.filter(categories__value="write"))

    def _aggregate_dates(self, actions):
        """Calculate a date range based on the dates of related actions"""
        dates = [action.date for action in actions]
        lower = min(date.year_lower for date in dates)
        upper = max(data.year_upper for data in dates)
        return lower, upper


class Category(models.Model):
    label = models.CharField(max_length=200, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)

    class Meta:
        verbose_name = "letter category"
        verbose_name_plural = "letter categories"

    def __str__(self):
        return self.label


class LetterCategory(Field, models.Model):
    category = models.ForeignKey(to=Category, null=True, on_delete=models.SET_NULL)
    letter = models.OneToOneField(
        to=Letter,
        on_delete=models.CASCADE,
        null=False,
    )

    def __str__(self):
        return f"category of {self.letter}"


class LetterMaterial(Field, models.Model):
    class Surface(models.TextChoices):
        PARCHMENT = "parchment", "parchment"
        PAPYRUS = "papyrus", "papyrus"
        OTHER = "other", "other"
        UNKNOWN = "unknown", "unknown"

    surface = models.CharField(
        choices=Surface.choices,
        null=False,
        blank=False,
    )
    letter = models.OneToOneField(
        to=Letter,
        on_delete=models.CASCADE,
        null=False,
    )

    def __str__(self):
        if self.letter:
            return f"material of {self.letter}"
        else:
            return f"material #{self.id}"


class LetterSenders(Field, models.Model):
    senders = models.ManyToManyField(
        to=Agent,
        blank=True,
        help_text="Agents whom the letter names as the sender",
    )
    letter = models.OneToOneField(
        to=Letter,
        on_delete=models.CASCADE,
        null=False,
    )

    def __str__(self):
        if self.letter:
            return f"senders of {self.letter}"
        else:
            return f"senders #{self.id}"


class LetterAddressees(Field, models.Model):
    addressees = models.ManyToManyField(
        to=Agent,
        blank=True,
        help_text="Agents whom the letter names as the addressee",
    )
    letter = models.OneToOneField(
        to=Letter,
        on_delete=models.CASCADE,
        null=False,
    )

    def __str__(self):
        if self.letter:
            return f"addressees of {self.letter}"
        else:
            return f"addressees #{self.id}"
