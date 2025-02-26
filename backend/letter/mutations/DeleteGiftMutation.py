from graphene import ID, Boolean, List, Mutation, NonNull, ResolveInfo

from letter.models import GiftDescription
from letter.types.GiftDescriptionType import GiftDescriptionType
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from user.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG


class DeleteGiftMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        id = ID(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, id: str):
        try:
            gift = GiftDescriptionType.get_queryset(
                GiftDescription.objects, info
            ).get(id=id)
        except GiftDescription.DoesNotExist:
            error = LettercraftErrorType(field="id", messages=["Gift not found."])
            return cls(ok=False, errors=[error])  # type: ignore

        if not can_edit_source(info.context.user, gift.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        gift.delete()
        return cls(ok=True, errors=[])  # type: ignore
