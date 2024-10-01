from graphene import Field, ResolveInfo
from graphene_django import DjangoObjectType
from core.types.HistoricalEntityType import HistoricalEntityType
from django.db.models import QuerySet
from person.models import HistoricalPerson
from person.types.PersonDateOfBirthType import PersonDateOfBirthType
from person.types.PersonDateOfDeathType import PersonDateOfDeathType


class HistoricalPersonType(HistoricalEntityType, DjangoObjectType):
    date_of_birth = Field(PersonDateOfBirthType)
    date_of_death = Field(PersonDateOfDeathType)

    class Meta:
        model = HistoricalPerson
        fields = [
            "id",
            "date_of_birth",
            "date_of_death",
        ] + HistoricalEntityType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[HistoricalPerson], info: ResolveInfo
    ) -> QuerySet[HistoricalPerson]:
        return queryset.all()
