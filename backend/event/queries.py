from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean, String
from django.contrib.auth.models import AnonymousUser
from django.db.models import QuerySet, Q
from event.models import Episode, EpisodeCategory, EpisodeEntity
from typing import Optional, Union, List as TList
from event.types.EpisodeCategoryType import EpisodeCategoryType
from event.types.EpisodeType import EpisodeType
from event.types.EpisodeEntityLink import EpisodeEntityLink
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS
from graphql_app.types.FilterableListField import FilterableListField
from user.models import User
from user.permissions import editable_sources, can_view_source


class EventQueries(ObjectType):
    episode = Field(
        EpisodeType,
        id=ID(required=True),
        editable=Boolean(
            description="Only select episodes from sources that are editable by the user."
        ),
    )
    episodes = FilterableListField(
        NonNull(EpisodeType),
        required=True,
        source_id=ID(),
        editable=Boolean(),
        public_only=Boolean(),
        ids=List(String),
    )
    episode_categories = List(NonNull(EpisodeCategoryType), required=True)
    episode_entity_link = Field(
        EpisodeEntityLink,
        entity=ID(required=True),
        episode=ID(required=True),
        entity_type=Entity(required=True),
    )

    @staticmethod
    def resolve_episode(
        parent: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[Episode]:
        try:
            episode = EpisodeType.get_queryset(Episode.objects, info).get(id=id)
        except Episode.DoesNotExist:
            return None

        user: Union[User, AnonymousUser] = info.context.user

        return episode if episode.is_accessible_to_user(user, editable) else None

    @staticmethod
    def resolve_episodes(
        parent: None,
        info: ResolveInfo,
        source_id: Optional[str] = None,
        editable=False,
        public_only=False,
        ids: Optional[TList[str]] = [],
        **kwargs: dict,
    ) -> QuerySet[Episode]:
        queryset = EpisodeType.get_queryset(Episode.objects, info)
        user: User = info.context.user

        filters = Q()
        if source_id is not None:
            filters &= Q(source_id=source_id)
        if editable:
            filters &= Q(source__in=editable_sources(user))
        if public_only:
            filters &= Q(source__is_public=True)
        if ids:
            filters &= Q(id__in=ids)

        return queryset.filter(filters)

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
    ) -> Optional[EpisodeEntityLink]:
        Model = ENTITY_MODELS[entity_type]
        query = {Model.entity_field: entity, "episode": episode}
        obj: EpisodeEntity = Model.objects.get(**query)
        if can_view_source(info.context.user, obj.episode.source):
            return obj
