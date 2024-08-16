from graphene import Field, Int, List, NonNull, ResolveInfo
from django.db.models import QuerySet, Value, Case, When, F
from graphene_django import DjangoObjectType
from event.models import Episode
from source.models import Source
from event.types.EpisodeType import EpisodeType
from source.types.SourceContentsDateType import SourceContentsDateType
from source.types.SourceWrittenDateType import SourceWrittenDateType


class SourceType(DjangoObjectType):
    episodes = List(NonNull(EpisodeType), required=True)
    num_of_episodes = Int(required=True)
    written_date = Field(SourceWrittenDateType)
    contents_date = Field(SourceContentsDateType)

    class Meta:
        model = Source
        fields = [
            "id",
            "name",
            "medieval_title",
            "medieval_author",
            "edition_title",
            "edition_author",
        ]

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[Source], info: ResolveInfo
    ) -> QuerySet[Source]:
        return queryset.all()

    @staticmethod
    def resolve_episodes(parent: Source, info: ResolveInfo) -> QuerySet[Episode]:
        # Sort by book, chapter, page.
        # If any of these fields are null are an empty string, sort them to the end.

        SORT_LAST = Value("ZZZZZZ")

        return (
            EpisodeType.get_queryset(Episode.objects, info)
            .filter(source_id=parent.pk)
            .annotate(
                book_order=Case(
                    When(book__isnull=True, then=SORT_LAST),
                    When(book="", then=SORT_LAST),
                    default=F("book"),
                ),
                chapter_order=Case(
                    When(chapter__isnull=True, then=SORT_LAST),
                    When(chapter="", then=SORT_LAST),
                    default=F("chapter"),
                ),
                page_order=Case(
                    When(page__isnull=True, then=SORT_LAST),
                    When(page="", then=SORT_LAST),
                    default=F("page"),
                ),
            )
            .order_by("book_order", "chapter_order", "page_order")
        )

    @staticmethod
    def resolve_num_of_episodes(parent: Source, info: ResolveInfo) -> int:
        return (
            EpisodeType.get_queryset(Episode.objects, info)
            .filter(source_id=parent.pk)
            .count()
        )
