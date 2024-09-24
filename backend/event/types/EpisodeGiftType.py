from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.entity import EntityDescription
from core.types.DescriptionFieldType import DescriptionFieldType
from event.models import EpisodeGift
from event.types.EpisodeEntityLink import EpisodeEntityLink


class EpisodeGiftType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)

    class Meta:
        model = EpisodeGift
        fields = [
            "id",
            "episode",
            "gift",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
