from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.entity import Entity, EntityInterface
from core.types.DescriptionFieldType import DescriptionFieldType, SourceMentionEnum
from event.models import EpisodeGift
from event.types.EpisodeEntityLink import EpisodeEntityLink


class EpisodeGiftType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityInterface)
    entity_type = NonNull(Entity)

    class Meta:
        model = EpisodeGift
        fields = [
            "id",
            "episode",
            "gift",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
