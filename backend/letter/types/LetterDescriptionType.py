from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet, Q
from django_filters import CharFilter, FilterSet

from core.types.EntityDescriptionType import EntityDescriptionType
from letter.models import LetterCategory, LetterDescription
from letter.types.LetterCategoryType import LetterCategoryType
from event.models import EpisodeLetter
from event.types.EpisodeLetterType import EpisodeLetterType

class LetterDescriptionFilter(FilterSet):
    search = CharFilter(method="search_letter_descriptions")

    def search_letter_descriptions(
        self, queryset: QuerySet[LetterDescription], name: str, value: str
    ) -> QuerySet[LetterDescription]:
        """Filter letter descriptions by name or description."""
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )

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
