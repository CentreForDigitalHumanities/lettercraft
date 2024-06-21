from graphene import ResolveInfo
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

    @staticmethod
    def resolve_location(parent: AgentDescriptionLocation, info: ResolveInfo) -> str:
        # TODO: Write SpaceDescriptionType
        return str(parent.location)
