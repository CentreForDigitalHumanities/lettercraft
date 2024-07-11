from graphene import ResolveInfo
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.DescriptionFieldType import DescriptionFieldType
from space.models import StructureField


class StructureFieldType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = StructureField
        fields = [
            "id",
            "space",
            "structure",
        ] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[StructureField], info: ResolveInfo
    ) -> QuerySet[StructureField]:
        return queryset.all()
