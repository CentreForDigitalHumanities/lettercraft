from graphene_django import DjangoObjectType
from graphene import Enum, NonNull

from core.types.DescriptionFieldType import DescriptionFieldType
from person.models import AgentDescriptionGender, Gender

GenderEnum = Enum.from_enum(Gender)


class AgentDescriptionGenderType(DescriptionFieldType, DjangoObjectType):
    gender = NonNull(GenderEnum)

    class Meta:
        model = AgentDescriptionGender
        fields = [
            "id",
            "agent",
            "gender",
        ] + DescriptionFieldType.fields()
