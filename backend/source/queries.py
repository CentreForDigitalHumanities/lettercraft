from graphene import ObjectType
from graphene_django import DjangoListField

from source.types.SourceType import SourceType


class SourceQueries(ObjectType):
    sources = DjangoListField(SourceType)
