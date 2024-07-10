from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.NamedType import NamedType
from letter.models import GiftCategory


class GiftCategoryType(NamedType, DjangoObjectType):
    class Meta:
        model = GiftCategory
        fields = ["id"] + NamedType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[GiftCategory], info: ResolveInfo
    ) -> QuerySet[GiftCategory]:
        return queryset.all()
