from graphene import ResolveInfo
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.DescriptionFieldType import DescriptionFieldType
from space.models import RegionField


class RegionFieldType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = RegionField
        fields = [
            "id",
            "space",
            "region",
        ] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[RegionField], info: ResolveInfo
    ) -> QuerySet[RegionField]:
        return queryset.all()
