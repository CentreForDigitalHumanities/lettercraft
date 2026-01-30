from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from core.types.EntityDescriptionType import EntityDescriptionType
from django.db.models import QuerySet, Q
from django_filters import FilterSet, CharFilter, BaseInFilter

from event.models import (
    Episode, EpisodeCategory, EpisodeAgent, EpisodeSpace, EpisodeLetter, EpisodeGift,
)
from event.types.EpisodeCategoryType import EpisodeCategoryType

class CharInFilter(BaseInFilter, CharFilter):
    pass

class EpisodeFilter(FilterSet):
    search = CharFilter(method="search_episodes")
    label_ids = CharInFilter(method="filter_by_labels")

    def search_episodes(self, queryset: QuerySet[Episode], name: str, value: str) -> QuerySet[Episode]:
        """Filter episodes by name, description or summary."""
        return queryset.filter(
            Q(name__icontains=value)
            | Q(description__icontains=value)
            | Q(summary__icontains=value)
        )

    def filter_by_labels(self, queryset: QuerySet[Episode], name: str, value: list[str]) -> QuerySet[Episode]:
        """Filter episodes by categories (labels)."""
        if not value:
            return queryset
        return queryset.filter(categories__id__in=value).distinct()

class EpisodeType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(EpisodeCategoryType), required=True)
    agents = List(
        NonNull("event.types.EpisodeAgentType.EpisodeAgentType"), required=True
    )
    spaces = List(NonNull("event.types.EpisodeSpaceType.EpisodeSpaceType"), required=True)
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
            "spaces",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces
        filterset_class = EpisodeFilter

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
