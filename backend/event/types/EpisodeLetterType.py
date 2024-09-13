from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from django.db.models import QuerySet

from event.models import EpisodeLetter
from event.types.EpisodeEntityLink import EpisodeEntityLink


class EpisodeLetterType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = EpisodeLetter
        fields = [
            "id",
            "episode",
            "letter",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[EpisodeLetter],
        info: ResolveInfo,
    ) -> QuerySet[EpisodeLetter]:
        return queryset.all()
