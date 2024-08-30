from graphene import ID, InputObjectType, List, NonNull, String


class EntityDescriptionInputType(InputObjectType):
    book = String()
    chapter = String()
    page = String()
    designators = List(NonNull(String))
    categories = List(NonNull(ID))
