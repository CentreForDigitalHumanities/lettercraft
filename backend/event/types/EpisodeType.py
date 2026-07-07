from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from core.types.EntityDescriptionType import EntityDescriptionType
from django.db.models import QuerySet
from django_filters import FilterSet, CharFilter

from event.models import (
    Episode, EpisodeCategory, EpisodeAgent, EpisodeSpace, EpisodeLetter, EpisodeGift,
)
from event.types.EpisodeCategoryType import EpisodeCategoryType
from graphql_app.utils import search_filter, CharInFilter


class EpisodeFilter(FilterSet):
    search = CharFilter(method="search_episodes")
    label_ids = CharInFilter(method="filter_by_labels")

    _search_fields = ['name', 'description', 'summary']

    def search_episodes(self, queryset: QuerySet[Episode], name: str, value: str) -> QuerySet[Episode]:
        """Filter episodes by name, description or summary."""
        return queryset.filter(search_filter(value, self._search_fields))

    def filter_by_labels(
    self, queryset: QuerySet[Episode], name: str, value: list[str]
    ) -> QuerySet[Episode]:
        """Filter episodes by categories (labels)."""
        if not value:
            return queryset
        return queryset.filter(categories__id__in=value).distinct()


class EpisodeType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(EpisodeCategoryType), required=True)
    agents = List(
        NonNull("event.types.EpisodeAgentType.EpisodeAgentType"), required=True
    )
    locations = List(NonNull("event.types.EpisodeSpaceType.EpisodeSpaceType"), required=True)
    letters = List(NonNull("event.types.EpisodeLetterType.EpisodeLetterType"), required=True)
    gifts = List(NonNull("event.types.EpisodeGiftType.EpisodeGiftType"), required=True)

    class Meta:
        model = Episode
        fields = [
            "id",
            "summary",
            "categories",
            "designators",
            "gifts",
            "letters",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces
        filterset_class = EpisodeFilter

    @staticmethod
    def resolve_agents(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeAgent]:
        return EpisodeAgent.objects.filter(episode=parent)

    @staticmethod
    def resolve_locations(
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
