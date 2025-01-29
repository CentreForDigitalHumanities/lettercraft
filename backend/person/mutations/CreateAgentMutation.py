from graphene import (
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Field,
)

from person.models import AgentDescription
from person.types.AgentDescriptionType import AgentDescriptionType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ValidationError
from django.db import transaction
from event.models import Episode
from core.types.EntityDescriptionType import CreateEntityDescriptionInput
from source.permissions import can_edit_source

class CreateAgentMutation(LettercraftMutation):
    django_model = AgentDescription

    ok = Boolean(required=True)
    agent = Field(AgentDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        agent_data = CreateEntityDescriptionInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, agent_data: CreateEntityDescriptionInput
    ):
        agent = cls.create_object()
        try:
            with transaction.atomic():
                cls.mutate_object(agent_data, agent, info)
                assert can_edit_source(info.context.user, agent.source)
                cls.add_contribution(agent, agent_data, info)
                agent.full_clean()
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, agent=None, errors=errors)
        except AssertionError:
            error = LettercraftErrorType(
                field="source",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(errors=[error])

        return cls(ok=True, agent=agent, errors=[])

    @staticmethod
    def add_contribution(
        agent: AgentDescription,
        agent_data: CreateEntityDescriptionInput,
        info: ResolveInfo,
    ):
        if info.context:
            user = info.context.user
            agent.contributors.add(user)

            if agent_data.episodes:
                for episode_id in agent_data.episodes:
                    episode = Episode.objects.get(id=episode_id)
                    episode.contributors.add(user)
