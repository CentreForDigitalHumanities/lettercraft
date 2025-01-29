from graphene import ID, Boolean, List, Mutation, NonNull, ResolveInfo

from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG


class DeleteSpaceMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        id = ID(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, id: str):
        try:
            space_description = SpaceDescriptionType.get_queryset(
                SpaceDescription.objects, info
            ).get(id=id)
        except SpaceDescription.DoesNotExist:
            error = LettercraftErrorType(field="id", messages=["Space not found."])
            return cls(ok=False, errors=[error])  # type: ignore

        if not can_edit_source(info.context.user, space_description.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        space_description.delete()
        return cls(ok=True, errors=[])  # type: ignore
