from graphene import ResolveInfo
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.HistoricalEntityType import HistoricalEntityType
from space.models import Structure


class StructureType(HistoricalEntityType, DjangoObjectType):
    class Meta:
        model = Structure
        fields = [
            "id",
            "settlement",
            "level",
        ] + HistoricalEntityType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[Structure], info: ResolveInfo
    ) -> QuerySet[Structure]:
        return queryset.all()
