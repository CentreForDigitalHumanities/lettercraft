from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet, Q
from typing import Optional

from person.models import AgentDescription, HistoricalPerson
from person.types.HistoricalPersonType import HistoricalPersonType
from person.types.AgentDescriptionType import AgentDescriptionType


class PersonQueries(ObjectType):
    agent_description = Field(AgentDescriptionType, id=ID(required=True))
    agent_descriptions = List(
        NonNull(AgentDescriptionType), required=True, episode_id=ID(), source_id=ID()
    )
    historical_persons = List(NonNull(HistoricalPersonType), required=True)

    @staticmethod
    def resolve_agent_description(
        parent: None, info: ResolveInfo, id: str
    ) -> Optional[AgentDescription]:
        try:
            return AgentDescriptionType.get_queryset(
                AgentDescription.objects, info
            ).get(id=id)
        except AgentDescription.DoesNotExist:
            return None

    @staticmethod
    def resolve_agent_descriptions(
        parent: None,
        info: ResolveInfo,
        episode_id: Optional[str] = None,
        source_id: Optional[str] = None,
    ) -> QuerySet[AgentDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)

        return AgentDescriptionType.get_queryset(AgentDescription.objects, info).filter(
            filters
        )

    @staticmethod
    def resolve_historical_persons(
        parent: None, info: ResolveInfo
    ) -> QuerySet[HistoricalPerson]:
        return HistoricalPersonType.get_queryset(HistoricalPerson.objects, info)
