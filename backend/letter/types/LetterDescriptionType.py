from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import LetterDescription


class LetterDescriptionType(EntityDescriptionType, DjangoObjectType):
    class Meta:
        model = LetterDescription
        fields = [
            "id",
            "categories",
        ] + EntityDescriptionType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[LetterDescription], info: ResolveInfo
    ) -> QuerySet[LetterDescription]:
        return queryset.all()
