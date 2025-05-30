from graphene import ID, Field, NonNull, ObjectType, ResolveInfo, Boolean
from typing import Optional
from django.db.models import QuerySet

from graphql_app.types.FilterableListField import FilterableListField
from source.models import Source
from source.types.SourceType import SourceType
from user.models import User
from user.permissions import editable_sources


class SourceQueries(ObjectType):
    source = Field(SourceType, id=ID(required=True))
    sources = FilterableListField(
        NonNull(SourceType),
        editable=Boolean(),
        required=True,
        public_only=Boolean()
    )

    @staticmethod
    def resolve_source(root: None, info: ResolveInfo, id: str) -> Optional[Source]:
        try:
            source = SourceType.get_queryset(Source.objects, info).get(pk=id)
        except Source.DoesNotExist:
            return None

        user: User = info.context.user

        # Public sources are visible to everyone.
        if user.is_superuser or source.is_public:
            return source

        # Non-public sources are visible to contributing users.
        if user.is_anonymous or not user.can_edit_source(source):
            return None

        return source


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
