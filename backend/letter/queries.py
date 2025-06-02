from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean
from django.db.models import QuerySet, Q
from django.contrib.auth.models import AnonymousUser
from typing import Optional

from letter.models import (
    GiftCategory,
    GiftDescription,
    LetterCategory,
    LetterDescription,
)
from letter.types.GiftCategoryType import GiftCategoryType
from letter.types.LetterCategoryType import LetterCategoryType
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType
from user.models import User
from user.permissions import editable_sources


class LetterQueries(ObjectType):
    letter_description = Field(
        LetterDescriptionType,
        id=ID(required=True),
        editable=Boolean(
            description="Only select letter descriptions from sources that are editable by the user."
        ),
    )

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

    gift_description = Field(
        GiftDescriptionType,
        id=ID(required=True),
        editable=Boolean(
            description="Only select gift descriptions from sources that are editable by the user."
        ),
    )

    gift_descriptions = List(
        NonNull(GiftDescriptionType),
        required=True,
        episode_id=ID(),
        source_id=ID(),
        editable=Boolean(),
    )

    gift_categories = List(
        NonNull(GiftCategoryType),
        required=True,
    )

    @staticmethod
    def resolve_letter_description(
        parent: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[LetterDescription]:
        try:
            letter_description = LetterDescriptionType.get_queryset(
                LetterDescription.objects, info
            ).get(id=id)
        except LetterDescription.DoesNotExist:
            return None

        user: User | AnonymousUser = info.context.user

        user_can_edit_source = user.is_anonymous is False and user.can_edit_source(
            letter_description.source
        )

        # Always return the requested object if the user can edit it.
        if user.is_superuser or user_can_edit_source:
            return letter_description

        # The user cannot edit this object
        # and the query only asks for editable objects.
        if editable:
            return None

        # Return non-editable objects iff their source is public.
        return letter_description if letter_description.source.is_public else None

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
        parent: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[GiftDescription]:
        try:
            gift_description = GiftDescriptionType.get_queryset(
                GiftDescription.objects, info
            ).get(id=id)
        except GiftDescription.DoesNotExist:
            return None

        user: User | AnonymousUser = info.context.user

        user_can_edit_source = user.is_anonymous is False and user.can_edit_source(
            gift_description.source
        )

        # Always return the requested object if the user can edit it.
        if user.is_superuser or user_can_edit_source:
            return gift_description

        # The user cannot edit this object
        # and the query only asks for editable objects.
        if editable:
            return None

        # Return non-editable objects iff their source is public.
        return gift_description if gift_description.source.is_public else None

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

    @staticmethod
    def resolve_gift_categories(
        parent: None, info: ResolveInfo
    ) -> QuerySet[GiftCategory]:
        return GiftCategoryType.get_queryset(GiftCategory.objects, info).all()
