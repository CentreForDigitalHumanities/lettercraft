from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.DescriptionFieldType import DescriptionFieldType
from letter.models import GiftDescriptionCategory


class GiftDescriptionCategoryType(DescriptionFieldType, DjangoObjectType):
    class Meta:
        model = GiftDescriptionCategory
        fields = [
            "id",
            "gift",
            "category",
        ] + DescriptionFieldType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[GiftDescriptionCategory], info: ResolveInfo
    ) -> QuerySet[GiftDescriptionCategory]:
        return queryset.all()
