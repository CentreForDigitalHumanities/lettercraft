from graphene import ID, NonNull, String, Interface, List
from core.types.DescriptionFieldType import SourceMentionEnum
from event.types.EpisodeType import EpisodeType
from core.types.entity import Entity, EntityDescription


class EpisodeEntityLink(Interface):
    id = NonNull(ID)
    episode = NonNull(EpisodeType)
    entity = NonNull(EntityDescription)
    source_mention = NonNull(SourceMentionEnum)
    note = String()
    designators = List(NonNull(String))
