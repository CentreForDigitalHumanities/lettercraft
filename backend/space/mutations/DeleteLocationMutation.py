from graphene import ID, Boolean, List, Mutation, NonNull, ResolveInfo

from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class DeleteLocationMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        id = ID(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, id: str):
        try:
            location = SpaceDescriptionType.get_queryset(SpaceDescription.objects, info).get(
                id=id
            )
        except SpaceDescription.DoesNotExist:
            error = LettercraftErrorType(field="id", messages=["Location not found."])
            return cls(ok=False, errors=[error])  # type: ignore

        location.delete()
        return cls(ok=True, errors=[])  # type: ignore
