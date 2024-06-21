from graphene_django import DjangoObjectType
from core.types.FieldType import LettercraftFieldType
from person.models import PersonReference


class PersonReferenceType(LettercraftFieldType, DjangoObjectType):
    class Meta:
        model = PersonReference
        fields = [
            "id",
            "person",
            "description",
        ] + LettercraftFieldType.fields()
