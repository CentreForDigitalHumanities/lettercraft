from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import GiftDescription


class GiftDescriptionType(EntityDescriptionType, DjangoObjectType):
    class Meta:
        model = GiftDescription
        fields = [
            "id",
            "categories",
        ] + EntityDescriptionType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[GiftDescription], info: ResolveInfo
    ) -> QuerySet[GiftDescription]:
        return queryset.all()
