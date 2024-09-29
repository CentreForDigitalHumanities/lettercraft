from graphene import Field, Int, List, NonNull, ResolveInfo
from django.db.models import QuerySet
from graphene_django import DjangoObjectType
from typing import Type

from event.models import Episode
from source.models import Source
from event.types.EpisodeType import EpisodeType
from source.types.SourceContentsDateType import SourceContentsDateType
from source.types.SourceWrittenDateType import SourceWrittenDateType
from person.models import AgentDescription
from person.types.AgentDescriptionType import AgentDescriptionType
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType
from letter.models import GiftDescription, LetterDescription
from core.models import EntityDescription
from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType

class SourceType(DjangoObjectType):
    episodes = List(NonNull(EpisodeType), required=True)
    num_of_episodes = Int(required=True)
    written_date = Field(SourceWrittenDateType)
    contents_date = Field(SourceContentsDateType)
    agents = List(NonNull(AgentDescriptionType), required=True)
    gifts = List(NonNull(GiftDescriptionType), required=True)
    letters = List(NonNull(LetterDescriptionType), required=True)
    spaces = List(NonNull(SpaceDescriptionType), required=True)

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

    @staticmethod
    def _entity_resolver(
        Model: Type[EntityDescription], OutputType: Type[DjangoObjectType]
    ):
        def resolve(parent: Source, info: ResolveInfo) -> QuerySet[Model]:
            return OutputType.get_queryset(Model.objects, info).filter(
                source__id=parent.pk
            )

        return resolve

    resolve_episodes = _entity_resolver(Episode, EpisodeType)
    resolve_agents = _entity_resolver(AgentDescription, AgentDescriptionType)
    resolve_gifts = _entity_resolver(GiftDescription, GiftDescriptionType)
    resolve_letters = _entity_resolver(LetterDescription, LetterDescriptionType)
    resolve_spaces = _entity_resolver(SpaceDescription, SpaceDescriptionType)

    @staticmethod
    def resolve_num_of_episodes(parent: Source, info: ResolveInfo) -> int:
        return SourceType.resolve_episodes(parent, info).count()
