from graphene import Enum, ResolveInfo
from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from person.models import AgentDescriptionGender, Gender

GQLGender = Enum.from_enum(Gender)


class AgentDescriptionGenderType(DescriptionFieldType, DjangoObjectType):
    gender = GQLGender(required=True)

    class Meta:
        model = AgentDescriptionGender
        fields = [
            "id",
            "agent",
            "gender",
        ] + DescriptionFieldType.fields()

    @staticmethod
    def resolve_gender(parent: AgentDescriptionGender, info: ResolveInfo) -> str:
        return parent.gender
