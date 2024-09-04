from graphene import (
    ID,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Mutation,
)

from event.models import EpisodeAgent
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class DeleteEpisodeAgentMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        agent = ID(required=True)
        episode = ID(required=True)

    @classmethod
    def mutate(
        cls,
        root: None,
        info: ResolveInfo,
        agent: ID,
        episode: ID,
    ):
        try:
            obj = EpisodeAgent.objects.get(agent__id=agent, episode__id=episode)
        except EpisodeAgent.DoesNotExist:
            return cls(
                ok=False,
                errors=LettercraftErrorType(
                    "agent__id", ["Relation object does not exist"]
                ),
            )

        obj.delete()

        return cls(ok=True, errors=[])
