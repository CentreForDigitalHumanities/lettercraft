from django.core.exceptions import ValidationError


def validate_level_deeper_than_parent(level, parent):
    if not level > parent.level:
        raise ValidationError(
            f"cannot add a structure of level {level} as  child to a structure of level {parent.level}"
        )
