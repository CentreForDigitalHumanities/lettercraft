from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from core.types.DescriptionFieldType import DescriptionFieldType
from django.db.models import QuerySet

from event.models import EpisodeGift
from event.types.EpisodeEntityLink import EpisodeEntityLink


class EpisodeGiftType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = EpisodeGift
        fields = [
            "id",
            "episode",
            "gift",
        ] + DescriptionFieldType.fields()
        interfaces = (EpisodeEntityLink,)

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[EpisodeGift],
        info: ResolveInfo,
    ) -> QuerySet[EpisodeGift]:
        return queryset.all()
