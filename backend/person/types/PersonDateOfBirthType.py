from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet
from core.types.DateFieldType import LettercraftDateType
from core.types.FieldType import LettercraftFieldType
from person.models import PersonDateOfBirth


class PersonDateOfBirthType(
    LettercraftFieldType, LettercraftDateType, DjangoObjectType
):
    class Meta:
        model = PersonDateOfBirth
        fields = (
            ["id", "person"]
            + LettercraftFieldType.fields()
            + LettercraftDateType.fields()
        )

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[PersonDateOfBirth], info: ResolveInfo
    ) -> QuerySet[PersonDateOfBirth]:
        return queryset.all()
