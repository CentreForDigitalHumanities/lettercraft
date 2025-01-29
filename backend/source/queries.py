from graphene import ID, Field, NonNull, ObjectType, ResolveInfo, Boolean
from graphene_django import DjangoListField
from typing import Optional
from django.db.models import QuerySet

from source.models import Source
from source.types.SourceType import SourceType
from source.permissions import editable_sources


class SourceQueries(ObjectType):
    source = Field(NonNull(SourceType), id=ID(required=True))
    sources = DjangoListField(
        NonNull(SourceType),
        editable=Boolean(),
        required=True,
    )

    @staticmethod
    def resolve_source(root: None, info: ResolveInfo, id: str) -> Optional[Source]:
        try:
            return SourceType.get_queryset(Source.objects, info).get(pk=id)
        except Source.DoesNotExist:
            return None

    @staticmethod
    def resolve_sources(
        root: None,
        info: ResolveInfo,
        editable: bool = False,
    ) -> QuerySet[Source]:
        queryset = SourceType.get_queryset(Source.objects, info)
        return editable_sources(info.context.user, queryset) if editable else queryset
