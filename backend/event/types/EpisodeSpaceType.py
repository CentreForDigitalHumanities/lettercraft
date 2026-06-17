from graphene import NonNull, ResolveInfo
from graphene_django import DjangoObjectType

from core.types.DescriptionFieldType import DescriptionFieldType
from core.types.entity import EntityDescription
from event.models import EpisodeSpace
from space.models import SpaceDescription
from event.types.EpisodeEntityLink import EpisodeEntityLink

class EpisodeSpaceType(DescriptionFieldType, DjangoObjectType):
    entity = NonNull(EntityDescription)
    location = NonNull('space.types.SpaceDescriptionType.SpaceDescriptionType')

    class Meta:
        model = EpisodeSpace
        fields = [
            "id",
            "episode",
            "location",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)

    @staticmethod
    def resolve_location(
        parent: EpisodeSpace, info: ResolveInfo
    ) -> SpaceDescription:
        return parent.space
