from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.FieldType import LettercraftFieldType
from letter.models import PreservedLetterRole


class PreservedLetterRoleType(LettercraftFieldType, DjangoObjectType):
    class Meta:
        model = PreservedLetterRole
        fields = [
            "id",
            "letter",
            "person",
        ] + LettercraftFieldType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[PreservedLetterRole], info: ResolveInfo
    ) -> QuerySet[PreservedLetterRole]:
        return queryset.all()
