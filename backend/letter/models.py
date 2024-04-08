from django.db import models
from core.models import Field, Historical, SourceDescription, DescriptionField
from person.models import AgentDescription, Person


class GiftDescription(SourceDescription, models.Model):
    """
    A gift described in a source text
    """

    gifted_by = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
        related_name="gifts_given",
        help_text="The agent who gave the gift. Leave empty if unknown.",
        null=True,
        blank=True,
    )


class GiftMaterial(DescriptionField, models.Model):
    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
        related_name="materials",
    )

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

    material = models.CharField(
        choices=Material.choices,
        help_text="The material the gift consists of",
    )


class GiftSender(DescriptionField, models.Model):
    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
        help_text="agent described as a sender of the gift",
    )


class GiftAddressee(DescriptionField, models.Model):
    gift = models.ForeignKey(
        to=GiftDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
        help_text="agent described as an addressee of the gift",
    )


class LetterDescription(SourceDescription, models.Model):
    """
    A description of a letter in a source text.
    """

    pass


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
        to=LetterDescription,
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

    letter = models.OneToOneField(
        to=LetterDescription,
        on_delete=models.CASCADE,
        null=False,
    )
    surface = models.CharField(
        choices=Surface.choices,
        null=False,
        blank=False,
        help_text="surface material, as described in the source text",
    )

    def __str__(self):
        if self.letter:
            return f"material of {self.letter}"
        else:
            return f"material #{self.id}"


class LetterSender(DescriptionField, models.Model):
    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
        help_text="agent described as a sender of the letter",
    )


class LetterAddressee(DescriptionField, models.Model):
    letter = models.ForeignKey(
        to=LetterDescription,
        on_delete=models.CASCADE,
    )
    agent = models.ForeignKey(
        to=AgentDescription,
        on_delete=models.CASCADE,
        help_text="agent described as an addressee of the letter",
    )


class PreservedLetter(Historical, models.Model):
    """
    A letter that has been preserved.
    """


class PreservedLetterRole(Field, models.Model):
    """
    Involvement of a historical figure with a preserved letter.
    """

    letter = models.ForeignKey(to=PreservedLetter, on_delete=models.CASCADE)
    person = models.ForeignKey(to=Person, on_delete=models.CASCADE)
