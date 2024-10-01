from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.DescriptionFieldType import DescriptionFieldType
from letter.models import LetterDescriptionCategory


class LetterDescriptionCategoryType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = LetterDescriptionCategory
        fields = [
            "id",
            "letter",
            "category",
        ] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet, info: ResolveInfo
    ) -> QuerySet[LetterDescriptionCategory]:
        return queryset.all()

