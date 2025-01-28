from django.contrib.auth.models import AnonymousUser

from user.models import User
from source.models import Source


def can_edit_source(user: User | AnonymousUser | None, source: Source):
    """
    Whether a user is allowed to edit a source
    """

    if user.is_superuser:
        return True

    if not user or user.is_anonymous or not user.is_contributor:
        return False

    return user.groups.filter(sources=source).exists()
