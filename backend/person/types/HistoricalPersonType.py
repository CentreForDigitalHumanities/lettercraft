from graphene_django import DjangoObjectType
from core.types.HistoricalEntityType import HistoricalEntityType
from django.db.models import QuerySet
from person.models import HistoricalPerson


class HistoricalPersonType(HistoricalEntityType, DjangoObjectType):
    class Meta:
        model = HistoricalPerson
        fields = ["id"] + HistoricalEntityType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[HistoricalPerson], info: QuerySet[HistoricalPerson]
    ) -> QuerySet[HistoricalPerson]:
        return queryset.all()
