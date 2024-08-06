from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from person.models import AgentDescriptionLocation


class AgentDescriptionLocationType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = AgentDescriptionLocation
        fields = [
            "id",
            "agent",
            "location",
        ] + DescriptionFieldType.fields()
