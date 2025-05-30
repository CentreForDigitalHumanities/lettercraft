from graphene import ID, Field, NonNull, ObjectType, ResolveInfo, Boolean
from typing import Optional
from django.db.models import QuerySet

from graphql_app.types.FilterableListField import FilterableListField
from source.models import Source
from source.types.SourceType import SourceType
from user.models import User
from user.permissions import editable_sources


class SourceQueries(ObjectType):
    source = Field(SourceType, id=ID(required=True), is_public=Boolean())
    sources = FilterableListField(
        NonNull(SourceType),
        editable=Boolean(),
        required=True,
    )

    @staticmethod
    def resolve_source(root: None, info: ResolveInfo, id: str, is_public = False) -> Optional[Source]:
        try:
            source = SourceType.get_queryset(Source.objects, info).get(pk=id)
        except Source.DoesNotExist:
            return None

        # Public browsing interface.
        if is_public:
            return source if source.is_public else None

        user: User = info.context.user

        # Non-public sources are visible to users allowed to edit them.
        if user.is_anonymous or not user.can_edit_source(source):
            return None

        return source


    @staticmethod
    def resolve_sources(
        root: None, info: ResolveInfo, editable: bool = False, **kwargs: dict
    ) -> QuerySet[Source]:
        queryset = SourceType.get_queryset(Source.objects, info)

        return editable_sources(info.context.user, queryset) if editable else queryset
