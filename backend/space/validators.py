from django.core.exceptions import ValidationError
from django.db.models import Choices, IntegerChoices


def get_label(value, options: Choices):
    return next(label for (v, label) in options.choices if v == value)


def validate_level_deeper_than_parent(level, parent, options: IntegerChoices):
    if not level > parent.level:
        level_label = get_label(level, options)
        parent_level_label = get_label(parent.level, options)
        raise ValidationError(
            f"Cannot add a structure of level {level} ({level_label}) as a child to a structure of level {parent.level} ({parent_level_label})"
        )
