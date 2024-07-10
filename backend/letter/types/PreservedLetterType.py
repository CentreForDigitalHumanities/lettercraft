from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.HistoricalEntityType import HistoricalEntityType
from letter.models import PreservedLetter


class PreservedLetterType(HistoricalEntityType, DjangoObjectType):
    class Meta:
        model = PreservedLetter
        fields = [
            "id",
            "persons_involved",
        ] + HistoricalEntityType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[PreservedLetter], info: ResolveInfo
    ) -> QuerySet[PreservedLetter]:
        return queryset.all()
