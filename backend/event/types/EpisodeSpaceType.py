from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType, SourceMentionEnum
from core.types.entity import Entity, EntityDescription
from event.models import EpisodeSpace
from event.types.EpisodeEntityLink import EpisodeEntityLink

class EpisodeSpaceType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)
    entity_type = NonNull(Entity)

    class Meta:
        model = EpisodeSpace
        fields = [
            "id",
            "episode",
            "space",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
