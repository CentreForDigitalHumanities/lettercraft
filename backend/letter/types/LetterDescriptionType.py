from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import LetterCategory, LetterDescription, LetterDescriptionCategory
from letter.types.LetterCategoryType import LetterCategoryType
from letter.types.LetterDescriptionCategoryType import LetterDescriptionCategoryType


class LetterDescriptionType(EntityDescriptionType, DjangoObjectType):
    # Direct access to foreign key
    categories = List(NonNull(LetterCategoryType), required=True)
    # Through model
    categorisations = List(NonNull(LetterDescriptionCategoryType), required=True)

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

    @staticmethod
    def resolve_categories(
        parent: LetterDescription, info: ResolveInfo
    ) -> QuerySet[LetterCategory]:
        return parent.categories.all()

    @staticmethod
    def resolve_categorisations(
        parent: LetterDescription, info: ResolveInfo
    ) -> QuerySet[LetterDescriptionCategory]:
        return LetterDescriptionCategory.objects.filter(letter=parent)
