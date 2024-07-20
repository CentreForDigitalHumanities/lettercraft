from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from django.db.models import QuerySet

from event.models import EpisodeSpace


class EpisodeSpaceType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = EpisodeSpace
        fields = [
            "id",
            "episode",
            "space",
        ] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[EpisodeSpace],
        info: ResolveInfo,
    ) -> QuerySet[EpisodeSpace]:
        return queryset.all()
