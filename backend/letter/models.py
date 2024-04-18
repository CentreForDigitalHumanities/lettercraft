from django.db import models
from django.core.exceptions import ValidationError

from core.models import (
    DescriptionField,
    EntityDescription,
    Named,
    HistoricalEntity,
    Field,
)
from person.models import AgentDescription, HistoricalPerson


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
    senders = models.ManyToManyField(
        to=AgentDescription,
        through="GiftDescriptionSender",
        related_name="gifts_sent",
        blank=True,
        help_text="agents described as the sender of the gift",
    )
    addressees = models.ManyToManyField(
        to=AgentDescription,
        through="GiftDescriptionAddressee",
        related_name="gifts_addressed",
        blank=True,
        help_text="agents described as the addressee of the gift",
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


class GiftDescriptionSender(DescriptionField, models.Model):
    """
    Description of a person as the sender of a gift
    """

    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.gift.source != self.agent.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return f"{self.agent.name} is sender of {self.gift.name} ({self.gift.source})"


class GiftDescriptionAddressee(DescriptionField, models.Model):
    """
    Description of a person as the addressee of a gift
    """

    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.gift.source != self.agent.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return (
            f"{self.agent.name} is addressee of {self.gift.name} ({self.gift.source})"
        )


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
    senders = models.ManyToManyField(
        to=AgentDescription,
        through="LetterDescriptionSender",
        related_name="letters_sent",
        blank=True,
        help_text="agents described as the sender of the letter",
    )
    addressees = models.ManyToManyField(
        to=AgentDescription,
        through="LetterDescriptionAddressee",
        related_name="letters_addressed",
        blank=True,
        help_text="agents described as the addressee of the letter",
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


class LetterDescriptionSender(DescriptionField, models.Model):
    """
    Description of a person as the sender of a letter
    """

    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.letter.source != self.agent.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return (
            f"{self.agent.name} is sender of {self.letter.name} ({self.letter.source})"
        )


class LetterDescriptionAddressee(DescriptionField, models.Model):
    """
    Description of a person as the addressee of a letter
    """

    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
    )

    def clean(self):
        if self.letter.source != self.agent.source:
            raise ValidationError("Can only link descriptions in the same source text")

    def __str__(self):
        return f"{self.agent.name} is addressee of {self.letter.name} ({self.letter.source})"


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
