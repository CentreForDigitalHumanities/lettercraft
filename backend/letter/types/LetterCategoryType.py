from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from letter.models import LetterCategory


class LetterCategoryType(DjangoObjectType):
    class Meta:
        model = LetterCategory
        fields = [
            "id",
            "label",
            "description",
        ]

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[LetterCategory], info: ResolveInfo
    ) -> QuerySet[LetterCategory]:
        return queryset.all()
