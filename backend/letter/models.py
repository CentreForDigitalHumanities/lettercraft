from django.db import models
from core.models import Field


class Letter(models.Model):
    def __str__(self):
        return f"letter #{self.id}"


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
