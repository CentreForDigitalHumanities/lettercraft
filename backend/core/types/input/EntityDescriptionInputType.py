from graphene import ID, InputObjectType, List, NonNull, String

from core.types.input.NamedInputType import NamedInputType


class EntityDescriptionInputType(NamedInputType, InputObjectType):
    book = String()
    chapter = String()
    page = String()
    categories = List(NonNull(ID))
