from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet, Q
from event.models import Episode, EpisodeAgent
from event.types.EpisodeType import EpisodeType
from event.types.EpisodeAgentType import EpisodeAgentType

class EventQueries(ObjectType):
    episode = Field(EpisodeType, id=ID(required=True))
    episodes = List(NonNull(EpisodeType), required=True, source_id=ID())
    episode_agent_link = Field(
        EpisodeAgentType, agent=ID(required=True), episode=ID(required=True)
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
