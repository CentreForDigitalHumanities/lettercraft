from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean
from django.db.models import QuerySet, Q
from typing import Optional

from letter.models import GiftDescription, LetterCategory, LetterDescription
from letter.types.LetterCategoryType import LetterCategoryType
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType
from source.permissions import editable_sources

class LetterQueries(ObjectType):
    letter_description = Field(LetterDescriptionType, id=ID(required=True))

    letter_descriptions = List(
        NonNull(LetterDescriptionType),
        required=True,
        episode_id=ID(),
        source_id=ID(),
        editable=Boolean(),
    )

    letter_categories = List(
        NonNull(LetterCategoryType),
        required=True,
    )

    gift_description = Field(GiftDescriptionType, id=ID(required=True))

    gift_descriptions = List(
        NonNull(GiftDescriptionType),
        required=True,
        episode_id=ID(),
        source_id=ID(),
        editable=Boolean(),
    )

    @staticmethod
    def resolve_letter_description(
        parent: None, info: ResolveInfo, id: str
    ) -> Optional[LetterDescription]:
        try:
            return LetterDescriptionType.get_queryset(
                LetterDescription.objects, info
            ).get(id=id)
        except LetterDescription.DoesNotExist:
            return None

    @staticmethod
    def resolve_letter_descriptions(
        parent: None,
        info: ResolveInfo,
        episode_id: Optional[str] = None,
        source_id: Optional[str] = None,
        editable: bool = False,
    ) -> QuerySet[LetterDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)
        if editable:
            user = info.context.user
            filters &= Q(source__in=editable_sources(user))

        return LetterDescriptionType.get_queryset(
            LetterDescription.objects, info
        ).filter(filters)

    @staticmethod
    def resolve_letter_categories(
        parent: None, info: ResolveInfo
    ) -> QuerySet[LetterCategory]:
        return LetterCategoryType.get_queryset(LetterCategory.objects, info).all()

    @staticmethod
    def resolve_gift_description(
        parent: None, info: ResolveInfo, id: str
    ) -> Optional[GiftDescription]:
        try:
            return GiftDescriptionType.get_queryset(GiftDescription.objects, info).get(
                id=id
            )
        except GiftDescription.DoesNotExist:
            return None

    @staticmethod
    def resolve_gift_descriptions(
        parent: None,
        info: ResolveInfo,
        episode_id: Optional[str] = None,
        source_id: Optional[str] = None,
        editable: bool = False,
    ) -> QuerySet[GiftDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)
        if editable:
            user = info.context.user
            filters &= Q(source__in=editable_sources(user))

        return GiftDescriptionType.get_queryset(GiftDescription.objects, info).filter(
            filters
        )
