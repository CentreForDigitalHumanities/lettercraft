from django.db import models

from core.models import (
    EntityDescription,
    HistoricalEntity,
    Field,
)
from person.models import HistoricalPerson



class GiftDescription(EntityDescription, models.Model):
    """
    A gift described in an narrative source text
    """


class LetterCategory(models.Model):
    """
    A type of letter (e.g. "private correspondence", "letter of entreaty")
    """
    label = models.CharField(max_length=200, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)

    class Meta:
        verbose_name = "letter category"
        verbose_name_plural = "letter categories"

    def __str__(self):
        return self.label


class LetterDescription(EntityDescription, models.Model):
    """
    A letter described in a narrative source text
    """
    categories = models.ManyToManyField(
        to=LetterCategory,
        blank=True,
        help_text="categories assigned to the letter",
        related_name="letters",
    )
