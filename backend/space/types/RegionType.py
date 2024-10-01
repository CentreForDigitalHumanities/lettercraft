from graphene import ResolveInfo
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.HistoricalEntityType import HistoricalEntityType
from space.models import Region


class RegionType(HistoricalEntityType, DjangoObjectType):
    class Meta:
        model = Region
        fields = [
            "id",
            "type",
        ] + HistoricalEntityType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[Region], info: ResolveInfo
    ) -> QuerySet[Region]:
        return queryset.all()
