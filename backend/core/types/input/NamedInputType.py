from graphene import InputObjectType, String


class NamedInputType(InputObjectType):
    name = String()
    description = String()
