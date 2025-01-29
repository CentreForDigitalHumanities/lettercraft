from django.contrib.auth.models import AnonymousUser
from django.db.models import QuerySet

from user.models import User
from source.models import Source


def editable_sources(
    user: User | AnonymousUser, sources: QuerySet[Source] = Source.objects
):
    if user.is_superuser:
        return sources.all()

    if not user or user.is_anonymous:
        return sources.none()

    return sources.filter(groups__user=user).distinct()


def can_edit_source(user: User | AnonymousUser | None, source: Source) -> bool:
    """
    Whether a user is allowed to edit a source
    """

    return source in editable_sources(user)
