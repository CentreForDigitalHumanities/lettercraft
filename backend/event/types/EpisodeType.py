from graphene import List, NonNull, ResolveInfo, Boolean
from graphene_django import DjangoObjectType
from core.types.EntityDescriptionType import EntityDescriptionType
from django.db.models import QuerySet

from event.models import (
    Episode, EpisodeCategory, EpisodeAgent, EpisodeSpace, EpisodeLetter, EpisodeGift,
)
from event.types.EpisodeCategoryType import EpisodeCategoryType
from user.permissions import can_edit_source


class EpisodeType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(EpisodeCategoryType), required=True)
    agents = List(
        NonNull("event.types.EpisodeAgentType.EpisodeAgentType"), required=True
    )
    spaces = List(NonNull("event.types.EpisodeSpaceType.EpisodeSpaceType"), required=True)
    letters = List(NonNull("event.types.EpisodeLetterType.EpisodeLetterType"), required=True)
    gifts = List(NonNull("event.types.EpisodeGiftType.EpisodeGiftType"), required=True)
    editable = Boolean(required=True)

    class Meta:
        model = Episode
        fields = [
            "id",
            "summary",
            "categories",
            "designators",
            "gifts",
            "letters",
            "spaces",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[Episode],
        info: ResolveInfo,
    ) -> QuerySet[Episode]:
        return queryset.all()

    @staticmethod
    def resolve_agents(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeAgent]:
        return EpisodeAgent.objects.filter(episode=parent)

    @staticmethod
    def resolve_spaces(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeSpace]:
        return EpisodeSpace.objects.filter(episode=parent)

    @staticmethod
    def resolve_gifts(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeGift]:
        return EpisodeGift.objects.filter(episode=parent)

    @staticmethod
    def resolve_letters(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeLetter]:
        return EpisodeLetter.objects.filter(episode=parent)


    @staticmethod
    def resolve_categories(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeCategory]:
        return parent.categories.all()

    @staticmethod
    def resolve_editable(parent: Episode, info: ResolveInfo) -> bool:
        return can_edit_source(info.context.user, parent.source)
