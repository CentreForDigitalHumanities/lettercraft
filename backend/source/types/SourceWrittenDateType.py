from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.DateFieldType import LettercraftDateType
from source.models import SourceWrittenDate


class SourceWrittenDateType(LettercraftDateType, DjangoObjectType):
    class Meta:
        model = SourceWrittenDate
        fields = [
            "id",
            "source",
        ] + LettercraftDateType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[SourceWrittenDate], info: ResolveInfo
    ) -> QuerySet[SourceWrittenDate]:
        return queryset.all()
