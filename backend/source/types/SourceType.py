from graphene import Field, Int, List, NonNull, ResolveInfo
from django.db.models import QuerySet, Value, Case, When, F
from graphene_django import DjangoObjectType
from event.models import Episode
from source.models import Source
from event.types.EpisodeType import EpisodeType
from source.types.SourceContentsDateType import SourceContentsDateType
from source.types.SourceWrittenDateType import SourceWrittenDateType
from person.models import AgentDescription
from person.types.AgentDescriptionType import AgentDescriptionType

class SourceType(DjangoObjectType):
    episodes = List(NonNull(EpisodeType), required=True)
    num_of_episodes = Int(required=True)
    written_date = Field(SourceWrittenDateType)
    contents_date = Field(SourceContentsDateType)
    agents = List(NonNull(AgentDescriptionType), required=True)

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
        return (
            EpisodeType.get_queryset(Episode.objects, info)
            .filter(source_id=parent.pk)
        )

    @staticmethod
    def resolve_num_of_episodes(parent: Source, info: ResolveInfo) -> int:
        return (
            EpisodeType.get_queryset(Episode.objects, info)
            .filter(source_id=parent.pk)
            .count()
        )

    @staticmethod
    def resolve_agents(parent: Source, info: ResolveInfo) -> QuerySet[AgentDescription]:
        return AgentDescriptionType.get_queryset(AgentDescription.objects, info).filter(
            source__id=parent.pk
        )
