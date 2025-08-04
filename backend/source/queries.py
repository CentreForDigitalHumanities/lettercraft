from graphene import ID, Field, NonNull, ObjectType, ResolveInfo, Boolean
from typing import Optional
from django.db.models import QuerySet
from django.contrib.auth.models import AnonymousUser

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
        public_only=Boolean(),
    )

    @staticmethod
    def resolve_source(
        root: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[Source]:
        try:
            source = SourceType.get_queryset(Source.objects, info).get(pk=id)
        except Source.DoesNotExist:
            return None

        user: Union[User, AnonymousUser] = info.context.user

        if user.is_superuser:
            return source

        if editable is False:
            return source if source.is_public else None

        user_can_edit = user.is_anonymous is False and user.can_edit_source(source)

        return source if user_can_edit else None

    @staticmethod
    def resolve_sources(
        root: None, info: ResolveInfo, editable=False, public_only=False, **kwargs: dict
    ) -> QuerySet[Source]:
        queryset = SourceType.get_queryset(Source.objects, info)
        user: User = info.context.user

        if editable:
            queryset = editable_sources(user)

        if public_only:
            queryset = queryset.filter(is_public=True)

        return queryset
