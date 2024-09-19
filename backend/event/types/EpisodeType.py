from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from core.types.EntityDescriptionType import EntityDescriptionType
from django.db.models import QuerySet

from event.models import Episode, EpisodeCategory
from event.types.EpisodeCategoryType import EpisodeCategoryType


class EpisodeType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(EpisodeCategoryType), required=True)

    class Meta:
        model = Episode
        fields = [
            "id",
            "summary",
            "categories",
            "agents",
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
    def resolve_categories(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeCategory]:
        return parent.categories.all()
