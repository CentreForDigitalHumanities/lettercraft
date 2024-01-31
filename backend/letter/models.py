from django.db import models
from core.models import Field


class Letter(models.Model):
    name = models.CharField(
        max_length=200,
        blank=False,
        unique=True,
        help_text="a unique name to identify this letter in the database",
    )

    def __str__(self):
        return self.name

    def date_written(self):
        """Date range in which the letter was written"""
        return self._aggregate_dates(self.events.filter(categories__value="write"))

    def date_active(self):
        """Date range in which anything happened with the letter"""
        return self._aggregate_dates(self.events.all())

    def _aggregate_dates(actions):
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
    surface = models.CharField(
        choices=[
            ("parchment", "parchment"),
            ("papyrus", "papyrus"),
            ("other", "other"),
            ("unknown", "unknown"),
        ],
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
