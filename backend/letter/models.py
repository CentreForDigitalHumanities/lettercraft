from django.db import models
from django.contrib import admin
from core.models import Field
from person.models import Person


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
        to=Person,
        blank=True,
        help_text="persons that the letter names as the sender",
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
        to=Person,
        blank=True,
        help_text="persons that the letter names as the addressee",
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
