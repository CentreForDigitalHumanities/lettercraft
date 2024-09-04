from graphene import (
    ID,
    String,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
)

from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from core.types.DescriptionFieldType import SourceMentionEnum
from event.models import EpisodeAgent


class UpdateEpisodeAgentInput(InputObjectType):
    agent = ID(required=True)
    episode = ID(required=True)
    source_mention = SourceMentionEnum()
    note = String()


class UpdateEpisodeAgentMutation(LettercraftMutation):
    django_model = EpisodeAgent

    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        data = UpdateEpisodeAgentInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, data: UpdateEpisodeAgentInput):
        try:
            obj = EpisodeAgent.objects.get(
                agent__id=data.agent, episode__id=data.episode
            )
        except EpisodeAgent.DoesNotExist as e:
            error = LettercraftErrorType(field="agent", messages=[str(e)])
            return cls(ok=False, error=[error])

        cls.mutate_object(data, obj, info)

        return cls(ok=True, errors=[])
