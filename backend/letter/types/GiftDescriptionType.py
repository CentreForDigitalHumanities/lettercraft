from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet, Q
from django_filters import CharFilter, FilterSet

from core.types.EntityDescriptionType import EntityDescriptionType
from graphql_app.filters import CharInFilter
from letter.models import GiftCategory, GiftDescription
from letter.types.GiftCategoryType import GiftCategoryType
from event.types.EpisodeGiftType import EpisodeGiftType
from event.models import EpisodeGift


class GiftDescriptionFilter(FilterSet):
    search = CharFilter(method="search_gift_descriptions")
    label_ids = CharInFilter(method="filter_by_labels")

    def search_gift_descriptions(
        self, queryset: QuerySet[GiftDescription], name: str, value: str
    ) -> QuerySet[GiftDescription]:
        """Filter gift descriptions by name or description."""
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )

    def filter_by_labels(
        self, queryset: QuerySet[GiftDescription], name: str, value: list[str]
    ) -> QuerySet[GiftDescription]:
        """Filter gift descriptions by categories (labels)."""
        if not value:
            return queryset
        return queryset.filter(episodes__categories__id__in=value).distinct()


class GiftDescriptionType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(GiftCategoryType), required=True)
    episodes = List(NonNull(EpisodeGiftType), required=True)

    class Meta:
        model = GiftDescription
        fields = [
            "id",
            "categories",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @staticmethod
    def resolve_categories(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[GiftCategory]:
        return parent.categories.all()

    @staticmethod
    def resolve_episodes(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeGift]:
        return EpisodeGift.objects.filter(gift=parent)
