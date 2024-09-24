from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType
from event.models import EpisodeAgent
from core.types.entity import Entity, EntityDescription
from event.types.EpisodeEntityLink import EpisodeEntityLink
from core.types.DescriptionFieldType import SourceMentionEnum

class EpisodeAgentType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)

    class Meta:
        model = EpisodeAgent
        fields = [
            "id",
            "episode",
            "agent",
            "entity",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
