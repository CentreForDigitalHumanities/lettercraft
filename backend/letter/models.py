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


class Category(models.Model):
    label = models.CharField(max_length=200, blank=False, null=False, unique=True)
    description = models.TextField(blank=True, null=False)

    def __str__(self):
        return self.label


class LetterCategory(Field, models.Model):
    category = models.ForeignKey(to=Category, null=True, on_delete=models.SET_NULL)
    letter = models.OneToOneField(
        to=Letter,
        on_delete=models.CASCADE,
        null=False,
    )


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
