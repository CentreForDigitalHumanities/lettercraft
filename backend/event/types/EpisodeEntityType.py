from graphene import Enum, ID, NonNull, ObjectType, String
from core.types.DescriptionFieldType import SourceMentionEnum
from event.models import (
    EpisodeAgent,
    EpisodeSpace,
    EpisodeLetter,
    EpisodeGift,
    EpisodeEntity,
)
from event.types.EpisodeType import EpisodeType
from typing import Dict, Type


class Entity(Enum):
    AGENT = "agent"
    GIFT = "gift"
    LETTER = "letter"
    SPACE = "space"


ENTITY_MODELS: Dict[str, Type[EpisodeEntity]] = {
    Entity.AGENT: EpisodeAgent,
    Entity.SPACE: EpisodeSpace,
    Entity.LETTER: EpisodeLetter,
    Entity.GIFT: EpisodeGift,
}


class EntityType(ObjectType):
    id = NonNull(ID)
    name = String()
    description = String()


class EpisodeEntityLinkType(ObjectType):
    id = NonNull(ID)
    episode = NonNull(EpisodeType)
    entity_type = NonNull(Entity)
    entity = NonNull(EntityType)
    source_mention = NonNull(SourceMentionEnum)
    note = String()
