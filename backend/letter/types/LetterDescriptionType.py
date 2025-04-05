from graphene import List, NonNull, ResolveInfo, Boolean
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import LetterCategory, LetterDescription
from letter.types.LetterCategoryType import LetterCategoryType
from event.models import EpisodeLetter
from event.types.EpisodeLetterType import EpisodeLetterType
from user.permissions import can_edit_source


class LetterDescriptionType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(LetterCategoryType), required=True)
    episodes = List(NonNull(EpisodeLetterType), required=True)
    # Computed
    editable = Boolean(required=True)

    class Meta:
        model = LetterDescription
        fields = [
            "id",
            "categories",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[LetterDescription], info: ResolveInfo
    ) -> QuerySet[LetterDescription]:
        return queryset.all()

    @staticmethod
    def resolve_categories(
        parent: LetterDescription, info: ResolveInfo
    ) -> QuerySet[LetterCategory]:
        return parent.categories.all()

    @staticmethod
    def resolve_episodes(
        parent: LetterDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeLetter]:
        return EpisodeLetter.objects.filter(letter=parent)

    @staticmethod
    def resolve_editable(parent: LetterDescription, info: ResolveInfo) -> bool:
        return can_edit_source(info.context.user, parent.source)
