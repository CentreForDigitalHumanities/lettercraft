from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from letter.models import GiftCategory


class GiftCategoryType(DjangoObjectType):
    class Meta:
        model = GiftCategory
        fields = [
            "id",
            "label",
            "description",
        ]

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[GiftCategory], info: ResolveInfo
    ) -> QuerySet[GiftCategory]:
        return queryset.all()
