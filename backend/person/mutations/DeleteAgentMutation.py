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
from user.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG


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
            agent = AgentDescription.objects.get(id=id)
        except AgentDescription.DoesNotExist:
            return cls(ok=False, errors=LettercraftErrorType("id", ["Agent not found"]))

        if not can_edit_source(info.context.user, agent.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        agent.delete()

        return cls(ok=True, errors=[])
