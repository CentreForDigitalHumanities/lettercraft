from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType
from event.models import EpisodeAgent
from core.types.entity import Entity, EntityInterface
from event.types.EpisodeEntityLink import EpisodeEntityLink
from core.types.DescriptionFieldType import SourceMentionEnum

class EpisodeAgentType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityInterface)
    entity_type = NonNull(Entity)
    source_mention = NonNull(SourceMentionEnum)

    class Meta:
        model = EpisodeAgent
        fields = [
            "id",
            "episode",
            "agent",
            "entity",
            "entity_type",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
