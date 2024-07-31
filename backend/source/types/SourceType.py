from graphene import Field, Int, List, ResolveInfo
from django.db.models import QuerySet
from graphene_django import DjangoObjectType
from event.models import Episode
from source.models import Source
from event.types.EpisodeType import EpisodeType
from source.types.SourceContentsDateType import SourceContentsDateType
from source.types.SourceWrittenDateType import SourceWrittenDateType


class SourceType(DjangoObjectType):
    episodes = List(EpisodeType, required=True)
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
        return Episode.objects.filter(source_id=parent.pk)

    @staticmethod
    def resolve_num_of_episodes(parent: Source, info: ResolveInfo) -> int:
        return Episode.objects.filter(source_id=parent.pk).count()
