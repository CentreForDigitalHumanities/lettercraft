from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import LetterCategory, LetterDescription, LetterDescriptionCategory
from letter.types.LetterCategoryType import LetterCategoryType
from letter.types.LetterDescriptionCategoryType import LetterDescriptionCategoryType
from core.types.entity import EntityInterface
from event.models import EpisodeLetter
from event.types.EpisodeLetterType import EpisodeLetterType

class LetterDescriptionType(EntityDescriptionType, DjangoObjectType):
    # Direct access to foreign key
    categories = List(NonNull(LetterCategoryType), required=True)
    # Through model
    categorisations = List(NonNull(LetterDescriptionCategoryType), required=True)
    episodes = List(NonNull(EpisodeLetterType), required=True)

    class Meta:
        model = LetterDescription
        fields = [
            "id",
            "categories",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = (EntityInterface,)

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
    def resolve_categorisations(
        parent: LetterDescription, info: ResolveInfo
    ) -> QuerySet[LetterDescriptionCategory]:
        return LetterDescriptionCategory.objects.filter(letter=parent)

    @staticmethod
    def resolve_episodes(
        parent: LetterDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeLetter]:
        return EpisodeLetter.objects.filter(letter=parent)
