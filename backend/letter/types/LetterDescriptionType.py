from graphene import List, NonNull, ResolveInfo, Boolean
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import LetterCategory, LetterDescription
from letter.types.LetterCategoryType import LetterCategoryType
from event.models import EpisodeLetter
from event.types.EpisodeLetterType import EpisodeLetterType

class LetterDescriptionType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(LetterCategoryType), required=True)
    episodes = List(NonNull(EpisodeLetterType), required=True)

    class Meta:
        model = LetterDescription
        fields = [
            "id",
            "categories",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces


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
