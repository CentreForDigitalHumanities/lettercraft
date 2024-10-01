from typing import Dict, Type
from core.types.entity import Entity
from event.models import (
    EpisodeAgent,
    EpisodeSpace,
    EpisodeLetter,
    EpisodeGift,
    EpisodeEntity,
)

ENTITY_MODELS: Dict[str, Type[EpisodeEntity]] = {
    Entity.AGENT: EpisodeAgent,
    Entity.SPACE: EpisodeSpace,
    Entity.LETTER: EpisodeLetter,
    Entity.GIFT: EpisodeGift,
}
