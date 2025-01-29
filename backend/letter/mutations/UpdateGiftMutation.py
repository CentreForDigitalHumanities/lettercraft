from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo
from django.core.exceptions import ObjectDoesNotExist
from core.types.input.DescriptionFieldInputType import DescriptionFieldInputType
from core.types.input.EntityDescriptionInputType import EntityDescriptionInputType
from letter.models import GiftDescription
from graphql_app.LettercraftMutation import LettercraftMutation
from source.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class GiftCategorisationInput(DescriptionFieldInputType, InputObjectType):
    id = ID()
    category = ID(required=True)


class UpdateGiftInput(EntityDescriptionInputType, InputObjectType):
    id = ID(required=True)
    categorisations = List(NonNull(GiftCategorisationInput))


class UpdateGiftMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = GiftDescription

    class Arguments:
        gift_data = UpdateGiftInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, gift_data: UpdateGiftInput):
        try:
            retrieved_object = cls.get_or_create_object(info, gift_data)
        except ObjectDoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, errors=[error])  # type: ignore

        gift: GiftDescription = retrieved_object.object  # type: ignore

        if not can_edit_source(info.context.user, gift.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        try:
            cls.mutate_object(gift_data, gift, info, ["categorisations"])
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        # TODO: resolve categorisations

        user = info.context.user
        gift.contributors.add(user)

        gift.save()

        return cls(ok=True, errors=[])  # type: ignore
