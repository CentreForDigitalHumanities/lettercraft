from graphene import ID, Field, NonNull, ObjectType, ResolveInfo
from graphene_django import DjangoListField

from source.models import Source
from source.types.SourceType import SourceType


class SourceQueries(ObjectType):
    source = Field(NonNull(SourceType), id=ID(required=True))
    sources = DjangoListField(NonNull(SourceType), required=True)

    @staticmethod
    def resolve_source(root: None, info: ResolveInfo, id: str) -> Source | None:
        try:
            return SourceType.get_queryset(Source.objects, info).get(pk=id)
        except Source.DoesNotExist:
            return None
