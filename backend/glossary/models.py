from django.db import models
from django_prose_editor.fields import ProseEditorField

class GlossaryCategories(models.IntegerChoices):
    LETTERS = 1
    GIFTS = 2
    MESSENGERS = 3
    ACTIONS = 4


class GlossaryItem(models.Model):
    class Meta:
        ordering = ['category', 'term']

    term = models.CharField(
        max_length=256,
    )
    category = models.IntegerField(
        choices=GlossaryCategories.choices,
    )
    description = ProseEditorField(
        blank=True,
        extensions={
            "Italic": True,
        },
        sanitize=True,
    )


class GlossaryReferenceCategories(models.IntegerChoices):
    PRIMARY = 1
    REFERENCE = 2
    SECONDARY = 3


class GlossaryReference(models.Model):
    class Meta:
        ordering = ['category', 'name']

    name = models.CharField(
        help_text="name for admin overview and alphabetical sorting; not visible to users",
        max_length=256,
        blank=True,
    )
    category = models.IntegerField(
        choices=GlossaryReferenceCategories.choices,
    )
    reference = ProseEditorField(
        blank=True,
        extensions={
            "Italic": True,
        },
        sanitize=True,
    )
