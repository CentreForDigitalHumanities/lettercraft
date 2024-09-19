from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType, SourceMentionEnum
from core.types.entity import Entity, EntityDescription
from event.models import EpisodeLetter
from event.types.EpisodeEntityLink import EpisodeEntityLink

class EpisodeLetterType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)
    entity_type = NonNull(Entity)

    class Meta:
        model = EpisodeLetter
        fields = [
            "id",
            "episode",
            "letter",
            "entity",
            "entity_type",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
