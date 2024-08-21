from graphene import (
    ID,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Mutation,
)

from person.models import PersonReference
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


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
            raise LettercraftErrorType("id", "Reference not found")

        reference.delete()

        return cls(ok=True, errors=[])
