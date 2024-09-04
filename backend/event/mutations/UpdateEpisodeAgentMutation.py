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
    id = ID(required=True)
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
            reference = cls.get_object(info, data)
        except EpisodeAgent.DoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, error=[error])

        cls.mutate_object(data, reference, info)

        return cls(ok=True, errors=[])
