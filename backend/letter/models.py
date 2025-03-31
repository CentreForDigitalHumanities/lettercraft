from django.db import models

from core.models import (
    DescriptionField,
    EntityDescription,
    Named,
    HistoricalEntity,
    Field,
)
from person.models import HistoricalPerson


class GiftCategory(models.Model):
    """
    A type of gift (e.g. "silver cup", "hairshirt")
    """

    label = models.CharField(max_length=200, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)

    class Meta:
        verbose_name = "gift category"
        verbose_name_plural = "gift categories"

    def __str__(self):
        return self.label


class GiftDescription(EntityDescription, models.Model):
    """
    A gift described in an narrative source text
    """
    categories = models.ManyToManyField(
        to=GiftCategory,
        blank=True,
        help_text="categories assigned to the gift",
        related_name="gifts",
    )


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


class PreservedLetter(HistoricalEntity, models.Model):
    """
    A letter that has been preserved
    """

    persons_involved = models.ManyToManyField(
        to=HistoricalPerson,
        through="PreservedLetterRole",
        blank=True,
        help_text="historical figures related to the letter",
    )


class PreservedLetterRole(Field, models.Model):
    """
    Relationship between a preserved letter and a historical figure
    """

    letter = models.ForeignKey(
        to=PreservedLetter,
        on_delete=models.CASCADE,
    )
    person = models.ForeignKey(
        to=HistoricalPerson,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"role of {self.person} in {self.letter}"
