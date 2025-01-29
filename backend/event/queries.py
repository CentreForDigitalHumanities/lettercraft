from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean
from django.db.models import QuerySet, Q
from event.models import Episode, EpisodeCategory, EpisodeEntity
from typing import Optional
from event.types.EpisodeCategoryType import EpisodeCategoryType
from event.types.EpisodeType import EpisodeType
from event.types.EpisodeEntityLink import EpisodeEntityLink
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS
from source.permissions import editable_sources


class EventQueries(ObjectType):
    episode = Field(EpisodeType, id=ID(required=True))
    episodes = List(
        NonNull(EpisodeType),
        required=True,
        source_id=ID(),
        editable=Boolean(),
    )
    episode_categories = List(NonNull(EpisodeCategoryType), required=True)
    episode_entity_link = Field(
        EpisodeEntityLink,
        entity=ID(required=True),
        episode=ID(required=True),
        entity_type=Entity(required=True),
    )

    @staticmethod
    def resolve_episode(parent: None, info: ResolveInfo, id: str) -> Optional[Episode]:
        try:
            return EpisodeType.get_queryset(Episode.objects, info).get(id=id)
        except Episode.DoesNotExist:
            return None

    @staticmethod
    def resolve_episodes(
        parent: None,
        info: ResolveInfo,
        source_id: Optional[str] = None,
        editable: bool = False,
    ) -> QuerySet[Episode]:
        filters = Q()

        if source_id is not None:
            filters &= Q(source_id=source_id)
        if editable:
            user = info.context.user
            filters &= Q(source__in=editable_sources(user))

        return EpisodeType.get_queryset(Episode.objects, info).filter(filters)

    @staticmethod
    def resolve_episode_categories(
        parent: None, info: ResolveInfo
    ) -> QuerySet[EpisodeCategory]:
        return EpisodeCategoryType.get_queryset(EpisodeCategory.objects, info).all()

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
