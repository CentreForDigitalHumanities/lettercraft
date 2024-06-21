from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet
from core.types.DateFieldType import LettercraftDateType
from core.types.FieldType import LettercraftFieldType
from person.models import PersonDateOfDeath


class PersonDateOfDeathType(
    LettercraftFieldType, LettercraftDateType, DjangoObjectType
):
    class Meta:
        model = PersonDateOfDeath
        fields = (
            ["id", "person"]
            + LettercraftFieldType.fields()
            + LettercraftDateType.fields()
        )

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[PersonDateOfDeath], info: ResolveInfo
    ) -> QuerySet[PersonDateOfDeath]:
        return queryset.all()
