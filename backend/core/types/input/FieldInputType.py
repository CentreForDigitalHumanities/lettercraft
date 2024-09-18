from graphene import InputObjectType, Int, String


class FieldInputType(InputObjectType):
    certainty = String()
    note = String()
