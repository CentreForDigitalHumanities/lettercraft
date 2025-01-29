from graphene import ID, Boolean, List, Mutation, NonNull, ResolveInfo

from letter.models import LetterDescription
from letter.types.LetterDescriptionType import LetterDescriptionType
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from user.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG

class DeleteLetterMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        id = ID(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, id: str):
        try:
            letter = LetterDescriptionType.get_queryset(
                LetterDescription.objects, info
            ).get(id=id)
        except LetterDescription.DoesNotExist:
            error = LettercraftErrorType(field="id", messages=["Letter not found."])
            return cls(ok=False, errors=[error])  # type: ignore

        if not can_edit_source(info.context.user, letter.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        letter.delete()
        return cls(ok=True, errors=[])  # type: ignore
