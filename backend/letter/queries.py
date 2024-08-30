from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet, Q

from letter.models import GiftDescription, LetterDescription, LetterDescriptionCategory
from letter.types.LetterDescriptionCategoryType import LetterDescriptionCategoryType
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType


class LetterQueries(ObjectType):
    letter_description = Field(LetterDescriptionType, id=ID(required=True))

    letter_descriptions = List(
        NonNull(LetterDescriptionType), required=True, episode_id=ID(), source_id=ID()
    )

    letter_description_categories = List(
        NonNull(LetterDescriptionCategoryType),
        required=True,
        letter_id=ID(),
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
    def resolve_letter_description_categories(
        parent: None,
        info: ResolveInfo,
        letter_id: str | None = None,
    ) -> QuerySet[LetterDescriptionCategory]:
        filters = Q()
        if letter_id:
            filters &= Q(letter_id=letter_id)

        return LetterDescriptionCategoryType.get_queryset(
            LetterDescriptionCategory.objects, info
        ).filter(filters)

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
