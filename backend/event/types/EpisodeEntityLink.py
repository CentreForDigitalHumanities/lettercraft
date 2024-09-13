from graphene import ID, NonNull, String, Interface
from core.types.DescriptionFieldType import SourceMentionEnum
from event.types.EpisodeType import EpisodeType
from core.types.entity import Entity, EntityInterface


class EpisodeEntityLink(Interface):
    id = NonNull(ID)
    episode = NonNull(EpisodeType)
    entity_type = NonNull(Entity)
    entity = NonNull(EntityInterface)
    source_mention = NonNull(SourceMentionEnum)
    note = String()
