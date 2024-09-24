from graphene import NonNull
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType
from core.types.entity import EntityDescription
from event.models import EpisodeSpace
from event.types.EpisodeEntityLink import EpisodeEntityLink

class EpisodeSpaceType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)

    class Meta:
        model = EpisodeSpace
        fields = [
            "id",
            "episode",
            "space",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)
