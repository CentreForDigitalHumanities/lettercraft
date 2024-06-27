from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from person.models import AgentDescriptionGender


class AgentDescriptionGenderType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = AgentDescriptionGender
        fields = [
            "id",
            "agent",
            "gender",
        ] + DescriptionFieldType.fields()
