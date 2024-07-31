from graphene import NonNull, ObjectType
from graphene_django import DjangoListField

from source.types.SourceType import SourceType


class SourceQueries(ObjectType):
    sources = DjangoListField(NonNull(SourceType), required=True)
