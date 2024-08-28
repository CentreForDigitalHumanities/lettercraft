from graphene import (
    ID,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    String,
    Field,
)

from person.models import AgentDescription
from person.types.AgentDescriptionType import AgentDescriptionType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ValidationError
from django.db import transaction


class CreateAgentInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateAgentMutation(LettercraftMutation):
    django_model = AgentDescription

    ok = Boolean(required=True)
    agent = Field(AgentDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        agent_data = CreateAgentInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, agent_data: CreateAgentInput):
        agent = cls.create_object()
        try:
            with transaction.atomic():
                cls.mutate_object(agent_data, agent, info)
                agent.full_clean()
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, agent=None, errors=errors)

        return cls(ok=True, agent=agent, errors=[])
