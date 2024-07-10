from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from core.types.EntityDescriptionType import EntityDescriptionType
from django.db.models import QuerySet

from event.models import Episode


class EpisodeType(EntityDescriptionType, DjangoObjectType):
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

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[Episode],
        info: ResolveInfo,
    ) -> QuerySet[Episode]:
        return queryset.all()
