from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet, Q
from typing import Optional

from letter.models import GiftDescription, LetterDescription
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType


class LetterQueries(ObjectType):
    letter_description = Field(LetterDescriptionType, id=ID(required=True))

    letter_descriptions = List(
        NonNull(LetterDescriptionType), required=True, episode_id=ID(), source_id=ID()
    )

    gift_description = Field(GiftDescriptionType, id=ID(required=True))

    gift_descriptions = List(
        NonNull(GiftDescriptionType), required=True, episode_id=ID(), source_id=ID()
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
    def resolve_gift_description(
        parent: None, info: ResolveInfo, id: str
    ) -> Optional[GiftDescription]:
        try:
            return GiftDescriptionType.get_queryset(
                GiftDescription.objects, info
            ).get(id=id)
        except GiftDescription.DoesNotExist:
            return None

    @staticmethod
    def resolve_gift_descriptions(
        parent: None,
        info: ResolveInfo,
        episode_id: Optional[str] = None,
        source_id: Optional[str] = None,
    ) -> QuerySet[GiftDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)

        return GiftDescriptionType.get_queryset(
            GiftDescription.objects, info
        ).filter(filters)
