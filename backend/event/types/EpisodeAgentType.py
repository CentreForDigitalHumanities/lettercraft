from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from django.db.models import QuerySet

from event.models import EpisodeAgent


class EpisodeAgentType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = EpisodeAgent
        fields = [
            "id",
            "episode",
            "agent",
        ] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[EpisodeAgent],
        info: ResolveInfo,
    ) -> QuerySet[EpisodeAgent]:
        return queryset.all()
