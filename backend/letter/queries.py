from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet, Q

from letter.models import GiftDescription, LetterCategory, LetterDescription
from letter.types.LetterCategoryType import LetterCategoryType
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType


class LetterQueries(ObjectType):
    letter_description = Field(LetterDescriptionType, id=ID(required=True))

    letter_descriptions = List(
        NonNull(LetterDescriptionType), required=True, episode_id=ID(), source_id=ID()
    )

    letter_categories = List(
        NonNull(LetterCategoryType),
        required=True,
    )

    gift_description = Field(GiftDescriptionType, id=ID(required=True))

    gift_descriptions = List(
        NonNull(GiftDescriptionType), required=True, episode_id=ID(), source_id=ID()
    )

    @staticmethod
    def resolve_letter_description(
        parent: None, info: ResolveInfo, id: str
    ) -> LetterDescription | None:
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
        episode_id: str | None = None,
        source_id: str | None = None,
    ) -> QuerySet[LetterDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)

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
    ) -> GiftDescription | None:
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
        episode_id: str | None = None,
        source_id: str | None = None,
    ) -> QuerySet[GiftDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)

        return GiftDescriptionType.get_queryset(GiftDescription.objects, info).filter(
            filters
        )
