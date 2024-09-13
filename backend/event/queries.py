from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet, Q
from event.models import Episode, EpisodeCategory, EpisodeEntity, EpisodeAgent
from event.types.EpisodeCategoryType import EpisodeCategoryType
from event.types.EpisodeType import EpisodeType
from event.types.EpisodeAgentType import EpisodeAgentType
from event.types.EpisodeEntityLink import EpisodeEntityLink
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS


class EventQueries(ObjectType):
    episode = Field(EpisodeType, id=ID(required=True))
    episodes = List(NonNull(EpisodeType), required=True, source_id=ID())
    episode_categories = List(NonNull(EpisodeCategoryType), required=True)
    episode_agent_link = Field(
        EpisodeAgentType, agent=ID(required=True), episode=ID(required=True)
    )
    episode_entity_link = Field(
        EpisodeEntityLink,
        entity=ID(required=True),
        episode=ID(required=True),
        entity_type=Entity(required=True),
    )

    @staticmethod
    def resolve_episode(parent: None, info: ResolveInfo, id: str) -> Episode | None:
        try:
            return EpisodeType.get_queryset(Episode.objects, info).get(id=id)
        except Episode.DoesNotExist:
            return None

    @staticmethod
    def resolve_episodes(
        parent: None,
        info: ResolveInfo,
        source_id: str | None = None,
    ) -> QuerySet[Episode]:
        filters = Q() if source_id is None else Q(source_id=source_id)

        return EpisodeType.get_queryset(Episode.objects, info).filter(filters)

    @staticmethod
    def resolve_episode_categories(
        parent: None, info: ResolveInfo
    ) -> QuerySet[EpisodeCategory]:
        return EpisodeCategoryType.get_queryset(EpisodeCategory.objects, info).all()

    @staticmethod
    def resolve_episode_agent_link(
        parent: None,
        info: ResolveInfo,
        agent: str,
        episode: str,
    ) -> EpisodeAgent | None:
        try:
            return EpisodeAgentType.get_queryset(EpisodeAgent.objects, info).get(
                agent__id=agent, episode__id=episode
            )
        except EpisodeAgent.DoesNotExist:
            return None

    @staticmethod
    def resolve_episode_entity_link(
        parent: None,
        info: ResolveInfo,
        entity: str,
        episode: str,
        entity_type: Entity,
    ) -> EpisodeEntityLink:
        Model = ENTITY_MODELS[entity_type]
        query = {Model.entity_field: entity, "episode": episode}
        obj: EpisodeEntity = Model.objects.get(**query)
        return obj
