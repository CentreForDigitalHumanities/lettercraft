from graphene import InputObjectType, String

from core.types.input.NamedInputType import NamedInputType


class EntityDescriptionInputType(NamedInputType, InputObjectType):
    book = String()
    chapter = String()
    page = String()
