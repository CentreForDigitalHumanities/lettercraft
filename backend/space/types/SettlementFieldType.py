from graphene import ResolveInfo
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.DescriptionFieldType import DescriptionFieldType
from space.models import SettlementField


class SettlementFieldType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = SettlementField
        fields = ["id", "space", "settlement"] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[SettlementField], info: ResolveInfo
    ) -> QuerySet[SettlementField]:
        return queryset.all()
