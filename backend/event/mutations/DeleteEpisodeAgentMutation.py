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
        id = ID(required=True)

    @classmethod
    def mutate(
        cls,
        root: None,
        info: ResolveInfo,
        id: ID,
    ):
        try:
            obj = EpisodeAgent.objects.get(id=id)
        except EpisodeAgent.DoesNotExist:
            return cls(
                ok=False, errors=LettercraftErrorType("id", ["Object not found"])
            )

        obj.delete()

        return cls(ok=True, errors=[])
