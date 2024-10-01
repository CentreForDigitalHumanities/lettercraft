from graphene import ResolveInfo
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.HistoricalEntityType import HistoricalEntityType
from space.models import Settlement


class SettlementType(HistoricalEntityType, DjangoObjectType):
    class Meta:
        model = Settlement
        fields = [
            "id",
            "regions",
        ] + HistoricalEntityType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[Settlement], info: ResolveInfo
    ) -> QuerySet[Settlement]:
        return queryset.all()
