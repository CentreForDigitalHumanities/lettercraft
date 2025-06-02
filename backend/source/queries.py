from click import edit
from graphene import ID, Field, NonNull, ObjectType, ResolveInfo, Boolean
from typing import Optional
from django.db.models import QuerySet

from graphql_app.types.FilterableListField import FilterableListField
from source.models import Source
from source.types.SourceType import SourceType
from user.models import User
from user.permissions import editable_sources


class SourceQueries(ObjectType):
    source = Field(
        SourceType,
        id=ID(required=True),
        editable=Boolean(
            description="Only select sources that are editable by the user."
        ),
    )
    sources = FilterableListField(
        NonNull(SourceType),
        editable=Boolean(
            description="Only select sources that are editable by the user."
        ),
        required=True,
        public_only=Boolean()
    )

    @staticmethod
    def resolve_source(
        root: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[Source]:
        try:
            source = SourceType.get_queryset(Source.objects, info).get(pk=id)
        except Source.DoesNotExist:
            return None

        user: User = info.context.user

        if user.is_anonymous:
            return None

        # Always return the source if the user can edit it.
        if user.is_superuser or user.can_edit_source(source):
            return source

        # The user cannot edit the source
        # and the query only asks for editable sources.
        if editable:
            return None

        # Return non-editable sources iff they are public.
        return source if source.is_public else None

    @staticmethod
    def resolve_sources(
        root: None, info: ResolveInfo, editable = False, public_only = False, **kwargs: dict
    ) -> QuerySet[Source]:
        queryset = SourceType.get_queryset(Source.objects, info)
        user: User = info.context.user

        if user.is_superuser:
            return queryset

        if editable:
            queryset = editable_sources(user)

        if public_only:
            queryset = queryset.filter(is_public=True)

        return queryset
