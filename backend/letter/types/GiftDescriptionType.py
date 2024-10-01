from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import GiftCategory, GiftDescription, GiftDescriptionCategory
from letter.types.GiftDescriptionCategoryType import GiftDescriptionCategoryType
from letter.types.GiftCategoryType import GiftCategoryType
from event.types.EpisodeGiftType import EpisodeGiftType
from event.models import EpisodeGift

class GiftDescriptionType(EntityDescriptionType, DjangoObjectType):
    # Direct access to foreign key
    categories = List(NonNull(GiftCategoryType), required=True)
    # Through model
    categorisations = List(NonNull(GiftDescriptionCategoryType), required=True)
    episodes = List(NonNull(EpisodeGiftType), required=True)

    class Meta:
        model = GiftDescription
        fields = [
            "id",
            "categories",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[GiftDescription], info: ResolveInfo
    ) -> QuerySet[GiftDescription]:
        return queryset.all()

    @staticmethod
    def resolve_categories(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[GiftCategory]:
        return parent.categories.all()

    @staticmethod
    def resolve_categorisations(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[GiftDescriptionCategory]:
        return GiftDescriptionCategory.objects.filter(gift=parent)

    @staticmethod
    def resolve_episodes(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeGift]:
        return EpisodeGift.objects.filter(gift=parent)
