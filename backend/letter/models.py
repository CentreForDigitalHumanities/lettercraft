from django.db import models

from core.models import (
    DescriptionField,
    EntityDescription,
    Named,
    HistoricalEntity,
    Field,
)
from person.models import HistoricalPerson


class GiftDescription(EntityDescription, models.Model):
    """
    A gift described in an narrative source text
    """

    categories = models.ManyToManyField(
        to="GiftCategory",
        through="GiftDescriptionCategory",
        blank=True,
        help_text="categories assigned to the gift",
    )


class GiftCategory(Named, models.Model):
    """
    A type of gift (e.g. "silver cup", "hairshirt")
    """

    class Meta:
        verbose_name_plural = "gift categories"


class GiftDescriptionCategory(DescriptionField, models.Model):
    """
    Categorisation of a gift in an a narrative source.
    """

    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )
    category = models.ForeignKey(
        to=GiftCategory,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"category {self.category} on {self.gift}"


class LetterDescription(EntityDescription, models.Model):
    """
    A letter described in a narrative source text
    """

    categories = models.ManyToManyField(
        to="Category",
        through="LetterDescriptionCategory",
        blank=True,
        help_text="categories assigned to the letter",
    )


class Category(models.Model):
    label = models.CharField(max_length=200, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)

    class Meta:
        verbose_name = "letter category"
        verbose_name_plural = "letter categories"

    def __str__(self):
        return self.label


class LetterDescriptionCategory(DescriptionField, models.Model):
    """
    Categorisation of a letter in an a narrative source.
    """

    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )
    category = models.ForeignKey(
        to=Category,
        on_delete=models.CASCADE,
    )

    def __str__(self) -> str:
        return f"category {self.category} on {self.letter}"


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
