from graphene import List, NonNull, ResolveInfo, Boolean
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import GiftCategory, GiftDescription
from letter.types.GiftCategoryType import GiftCategoryType
from event.types.EpisodeGiftType import EpisodeGiftType
from event.models import EpisodeGift


class GiftDescriptionType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(GiftCategoryType), required=True)
    episodes = List(NonNull(EpisodeGiftType), required=True)

    class Meta:
        model = GiftDescription
        fields = [
            "id",
            "categories",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @staticmethod
    def resolve_categories(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[GiftCategory]:
        return parent.categories.all()

    @staticmethod
    def resolve_episodes(
        parent: GiftDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeGift]:
        return EpisodeGift.objects.filter(gift=parent)
