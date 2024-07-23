from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from event.models import Series


class SeriesType(DjangoObjectType):
    class Meta:
        model = Series
        fields = [
            "id",
            "episodes",
        ]

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[Series],
        info: ResolveInfo,
    ) -> QuerySet[Series]:
        return queryset.all()
