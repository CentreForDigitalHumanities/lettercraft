from graphene import (
    ID,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Mutation,
)

from person.models import AgentDescription
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class DeleteAgentMutation(Mutation):
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
            reference = AgentDescription.objects.get(id=id)
        except AgentDescription.DoesNotExist:
            raise LettercraftErrorType("id", ["Agent not found"])

        reference.delete()

        return cls(ok=True, errors=[])
