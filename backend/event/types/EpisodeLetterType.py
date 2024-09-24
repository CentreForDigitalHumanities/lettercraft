from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType
from core.types.entity import EntityDescription
from event.models import EpisodeLetter
from event.types.EpisodeEntityLink import EpisodeEntityLink

class EpisodeLetterType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)

    class Meta:
        model = EpisodeLetter
        fields = [
            "id",
            "episode",
            "letter",
            "entity",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
