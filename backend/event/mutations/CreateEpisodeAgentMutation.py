from graphene import (
    ID,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
)

from person.models import AgentDescription
from event.models import Episode, EpisodeAgent
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ValidationError
from django.db import transaction


class CreateEpisodeAgentInput(InputObjectType):
    agent = ID(required=True)
    episode = ID(required=True)


class CreateEpisodeAgentMutation(LettercraftMutation):
    django_model = EpisodeAgent

    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        data = CreateEpisodeAgentInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, data: CreateEpisodeAgentInput):

        if EpisodeAgent.objects.filter(
            agent__id=data.agent, episode__id=data.episode
        ).exists():
            return cls(
                ok=False,
                errors=[LettercraftErrorType("agent", ["Link already exists"])],
            )

        try:
            episode = Episode.objects.get(id=data.episode)
        except Episode.DoesNotExist as e:
            return cls(
                ok=False,
                errors=[LettercraftErrorType("episode", [str(e)])],
            )

        try:
            agent = AgentDescription.objects.get(id=data.agent)
        except AgentDescription.DoesNotExist as e:
            return cls(
                ok=False,
                errors=[LettercraftErrorType("agent", [str(e)])],
            )

        try:
            with transaction.atomic():
                obj = EpisodeAgent.objects.create(agent=agent, episode=episode)
                obj.clean()
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, agent=None, errors=errors)

        return cls(ok=True, errors=[])
