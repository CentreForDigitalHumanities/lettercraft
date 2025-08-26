from django.contrib.auth.models import AnonymousUser
from django.db.models import QuerySet, Q
from typing import Union

from user.models import User
from source.models import Source

SOURCE_NOT_PERMITTED_MSG = (
    "Mutation affects a source text for which you do not have contributor access"
)
MATCH_NONE = Q(pk__in=[])
MATCH_ALL  = Q(pk__isnull=False)


type MaybeUser = Union[User, AnonymousUser, None]

def editable_condition(user: MaybeUser):
    if not user or user.is_anonymous:
        return MATCH_NONE
    if user.is_superuser:
        return MATCH_ALL

    groups = user.contributor_groups.all()
    return Q(contributor_groups__in=groups)


def editable_sources(
    user: MaybeUser, sources: QuerySet[Source] = Source.objects
) -> QuerySet[Source]:
    return sources.filter(editable_condition(user))


def can_edit_source(user: MaybeUser, source: Source) -> bool:
    """
    Whether a user is allowed to edit a source
    """

    return editable_sources(user).contains(source)


def visible_condition(user: MaybeUser):
    is_public = Q(is_public=True)

    if not user or user.is_anonymous:
        return is_public

    return is_public | editable_condition(user)


def visible_sources(user: Union[User, AnonymousUser]) -> QuerySet[Source]:
    return Source.objects.filter(visible_condition(user))


def can_view_source(user: MaybeUser, source: Source) -> bool:
    return visible_sources(user).contains(source)
