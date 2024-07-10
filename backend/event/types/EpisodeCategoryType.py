from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from core.types.NamedType import NamedType
from django.db.models import QuerySet
from event.models import EpisodeCategory


class EpisodeCategoryType(NamedType, DjangoObjectType):
    class Meta:
        model = EpisodeCategory
        fields = [
            "id",
        ] + NamedType.fields()

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[EpisodeCategory],
        info: ResolveInfo,
    ) -> QuerySet[EpisodeCategory]:
        return queryset.all()
