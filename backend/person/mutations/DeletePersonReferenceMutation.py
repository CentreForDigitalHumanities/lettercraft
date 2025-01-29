from graphene import (
    ID,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Mutation,
)

from person.models import PersonReference
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG

class DeletePersonReferenceMutation(Mutation):
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
            reference = PersonReference.objects.get(id=id)
        except PersonReference.DoesNotExist:
            return cls(
                ok=False, errors=LettercraftErrorType("id", ["Reference not found"])
            )

        if not can_edit_source(info.context.user, reference.description.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        reference.delete()

        return cls(ok=True, errors=[])
