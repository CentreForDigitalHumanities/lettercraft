from django_filters import FilterSet
from graphene import ID, Enum, Int, List, NonNull, ObjectType, Field, String
from django.db.models import QuerySet, Q

from event.queries import EventQueries
from letter.queries import LetterQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from source.types.SourceType import SourceFilter, SourceType
from event.types.EpisodeType import EpisodeFilter, EpisodeType
from person.types.AgentDescriptionType import (
    AgentDescriptionFilter,
    AgentDescriptionType,
)
from letter.types.LetterDescriptionType import (
    LetterDescriptionFilter,
    LetterDescriptionType,
)
from letter.types.GiftDescriptionType import GiftDescriptionFilter, GiftDescriptionType
from space.queries import SpaceQueries
from space.types.SpaceDescriptionType import (
    SpaceDescriptionFilter,
    SpaceDescriptionType,
)


class SearchResultsType(ObjectType):
    source_count = Int(required=True)
    episode_count = Int(required=True)
    agent_count = Int(required=True)
    letter_count = Int(required=True)
    gift_count = Int(required=True)
    location_count = Int(required=True)

    sources = List(NonNull(SourceType), required=True)
    episodes = List(NonNull(EpisodeType), required=True)
    agents = List(NonNull(AgentDescriptionType), required=True)
    letters = List(NonNull(LetterDescriptionType), required=True)
    gifts = List(NonNull(GiftDescriptionType), required=True)
    locations = List(NonNull(SpaceDescriptionType), required=True)


class SearchFocus(Enum):
    SOURCES = "SOURCES"
    EPISODES = "EPISODES"
    AGENTS = "AGENTS"
    ITEMS = "ITEMS"
    LOCATIONS = "LOCATIONS"


class CoreQueries(ObjectType):
    search = Field(
        SearchResultsType,
        search_focus=SearchFocus(required=True),
        search_term=String(required=True),
        label_ids=List(NonNull(ID), required=True),
    )

    def resolve_search(
        self, info, search_focus: SearchFocus, search_term: str, label_ids: list[str]
    ) -> SearchResultsType:
        """
        Resolve search query based on provided search_term and label_ids.

        Counts for each entity type are always calculated, but results are only returned
        for the type corresponding to the specified search_focus.

        Multiple label IDs are combined using OR logic.
        Labels and search term are combined using AND logic.
        """
        def apply_filter(queryset: QuerySet, filter_class: type[FilterSet]) -> QuerySet:
            """Apply search filter using the filter class if search_term or label_ids are provided."""
            if search_term or label_ids:
                return filter_class(data={"search": search_term, "label_ids": label_ids}, queryset=queryset).qs
            return queryset

        source_qs = apply_filter(
            SourceQueries.resolve_sources(None, info, public_only=True, editable=False),
            SourceFilter,
        ).distinct()
        episode_qs = apply_filter(
            EventQueries.resolve_episodes(None, info, public_only=True, editable=False),
            EpisodeFilter,
        ).distinct()
        agent_qs = apply_filter(
            PersonQueries.resolve_agent_descriptions(
                None, info, public_only=True, editable=False
            ),
            AgentDescriptionFilter,
        ).distinct()
        letter_qs = apply_filter(
            LetterQueries.resolve_letter_descriptions(
                None, info, public_only=True, editable=False
            ),
            LetterDescriptionFilter,
        ).distinct()
        gift_qs = apply_filter(
            LetterQueries.resolve_gift_descriptions(
                None, info, public_only=True, editable=False
            ),
            GiftDescriptionFilter,
        ).distinct()
        location_qs = apply_filter(
            SpaceQueries.resolve_space_descriptions(
                None, info, public_only=True, editable=False
            ),
            SpaceDescriptionFilter,
        ).distinct()

        sources = []
        episodes = []
        agents = []
        letters = []
        gifts = []
        locations = []

        match search_focus:
            case SearchFocus.SOURCES:
                sources = source_qs
            case SearchFocus.EPISODES:
                episodes = episode_qs
            case SearchFocus.AGENTS:
                agents = agent_qs
            case SearchFocus.ITEMS:
                letters = letter_qs
                gifts = gift_qs
            case SearchFocus.LOCATIONS:
                locations = location_qs

        return SearchResultsType(
            source_count=source_qs.count(),
            episode_count=episode_qs.count(),
            agent_count=agent_qs.count(),
            letter_count=letter_qs.count(),
            gift_count=gift_qs.count(),
            location_count=location_qs.count(),
            sources=sources,
            episodes=episodes,
            agents=agents,
            letters=letters,
            gifts=gifts,
            locations=locations,
        )
