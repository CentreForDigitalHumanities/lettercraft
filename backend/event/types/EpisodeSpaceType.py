from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType, SourceMentionEnum
from core.types.entity import Entity, EntityInterface
from event.models import EpisodeSpace
from event.types.EpisodeEntityLink import EpisodeEntityLink

class EpisodeSpaceType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityInterface)
    entity_type = NonNull(Entity)
    source_mention = NonNull(SourceMentionEnum)

    class Meta:
        model = EpisodeSpace
        fields = [
            "id",
            "episode",
            "space",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
