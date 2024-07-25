from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.DateFieldType import LettercraftDateType
from source.models import SourceContentsDate


class SourceContentsDateType(LettercraftDateType, DjangoObjectType):
    class Meta:
        model = SourceContentsDate
        fields = [
            "id",
            "source",
        ] + LettercraftDateType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[SourceContentsDate], info: ResolveInfo
    ) -> QuerySet[SourceContentsDate]:
        return queryset.all()
