from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo
from django.core.exceptions import ObjectDoesNotExist
from core.types.input.DescriptionFieldInputType import DescriptionFieldInputType
from core.types.input.EntityDescriptionInputType import EntityDescriptionInputType
from letter.models import LetterDescription
from graphql_app.LettercraftMutation import LettercraftMutation
from user.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class LetterCategorisationInput(DescriptionFieldInputType, InputObjectType):
    id = ID()
    category = ID(required=True)


class UpdateLetterInput(EntityDescriptionInputType, InputObjectType):
    id = ID(required=True)
    categorisations = List(NonNull(LetterCategorisationInput))


class UpdateLetterMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = LetterDescription

    class Arguments:
        letter_data = UpdateLetterInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, letter_data: UpdateLetterInput):
        try:
            retrieved_object = cls.get_or_create_object(info, letter_data)
        except ObjectDoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, errors=[error])  # type: ignore

        letter: LetterDescription = retrieved_object.object  # type: ignore

        if not can_edit_source(info.context.user, letter.source):
            error = LettercraftErrorType(
                field="id",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error]) # type: ignore

        try:
            cls.mutate_object(letter_data, letter, info)
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        user = info.context.user
        letter.contributors.add(user)

        letter.save()

        return cls(ok=True, errors=[])  # type: ignore
