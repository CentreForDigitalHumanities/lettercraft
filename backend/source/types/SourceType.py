from graphene import ResolveInfo
from django.db.models import QuerySet
from graphene_django import DjangoObjectType
from source.models import Source


class SourceType(DjangoObjectType):
    class Meta:
        model = Source

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[Source], info: ResolveInfo
    ) -> QuerySet[Source]:
        return queryset.all()
