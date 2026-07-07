from django_filters import FilterSet
from graphene import ID, List, NonNull, ObjectType, Field, String
from django.db.models import QuerySet

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
    sources = List(NonNull(SourceType), required=True)
    episodes = List(NonNull(EpisodeType), required=True)
    agents = List(NonNull(AgentDescriptionType), required=True)
    letters = List(NonNull(LetterDescriptionType), required=True)
    gifts = List(NonNull(GiftDescriptionType), required=True)
    locations = List(NonNull(SpaceDescriptionType), required=True)


class SearchQueries(ObjectType):
    search = Field(
        SearchResultsType,
        search_term=String(required=True),
        label_ids=List(NonNull(ID), required=True),
    )

    def resolve_search(
        self, info, search_term: str, label_ids: list[str]
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
                return filter_class(
                    data={"search": search_term, "label_ids": label_ids},
                    queryset=queryset,
                ).qs
            return queryset

        common_params = {
            "parent": None,
            "info": info,
            "public_only": True,
            "editable": False,
        }

        search_config = [
            {
                "queryset": SourceQueries.resolve_sources(**common_params),
                "filter_class": SourceFilter,
                "result_key": "sources",
            },
            {
                "queryset": EventQueries.resolve_episodes(**common_params),
                "filter_class": EpisodeFilter,
                "result_key": "episodes",
            },
            {
                "queryset": PersonQueries.resolve_agent_descriptions(**common_params),
                "filter_class": AgentDescriptionFilter,
                "result_key": "agents",
            },
            {
                "queryset": LetterQueries.resolve_letter_descriptions(**common_params),
                "filter_class": LetterDescriptionFilter,
                "result_key": "letters",
            },
            {
                "queryset": LetterQueries.resolve_gift_descriptions(**common_params),
                "filter_class": GiftDescriptionFilter,
                "result_key": "gifts",
            },
            {
                "queryset": SpaceQueries.resolve_space_descriptions(**common_params),
                "filter_class": SpaceDescriptionFilter,
                "result_key": "locations",
            },
        ]

        results = {}

        for config in search_config:
            qs = apply_filter(config["queryset"], config["filter_class"])
            results[config["result_key"]] = qs

        return SearchResultsType(**results)
