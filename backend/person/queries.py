from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean
from django.db.models import QuerySet, Q
from django.contrib.auth.models import AnonymousUser
from typing import Optional

from person.models import AgentDescription, HistoricalPerson
from person.types.HistoricalPersonType import HistoricalPersonType
from person.types.AgentDescriptionType import AgentDescriptionType
from user.models import User
from user.permissions import editable_sources


class PersonQueries(ObjectType):
    agent_description = Field(
        AgentDescriptionType,
        id=ID(required=True),
        editable=Boolean(
            description="Only select agent descriptions that are editable by the user."
        ),
    )
    agent_descriptions = List(
        NonNull(AgentDescriptionType),
        required=True,
        episode_id=ID(),
        source_id=ID(),
        editable=Boolean(),
    )
    historical_persons = List(NonNull(HistoricalPersonType), required=True)

    @staticmethod
    def resolve_agent_description(
        parent: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[AgentDescription]:
        try:
            agent_description = AgentDescriptionType.get_queryset(
                AgentDescription.objects, info
            ).get(id=id)
        except AgentDescription.DoesNotExist:
            return None

        user: Union[User, AnonymousUser] = info.context.user

        return (
            agent_description
            if agent_description.is_accessible_to_user(user, editable)
            else None
        )

    @staticmethod
    def resolve_agent_descriptions(
        parent: None,
        info: ResolveInfo,
        episode_id: Optional[str] = None,
        source_id: Optional[str] = None,
        editable: bool = False,
    ) -> QuerySet[AgentDescription]:
        filters = Q()
        if episode_id:
            filters &= Q(episode_id=episode_id)
        if source_id:
            filters &= Q(source_id=source_id)
        if editable:
            user = info.context.user
            filters &= Q(source__in=editable_sources(user))

        return AgentDescriptionType.get_queryset(AgentDescription.objects, info).filter(
            filters
        )

    @staticmethod
    def resolve_historical_persons(
        parent: None, info: ResolveInfo
    ) -> QuerySet[HistoricalPerson]:
        return HistoricalPersonType.get_queryset(HistoricalPerson.objects, info)
