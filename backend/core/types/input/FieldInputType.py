from graphene import InputObjectType, String


class FieldInputType(InputObjectType):
    note = String()
