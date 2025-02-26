from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo
from django.core.exceptions import ObjectDoesNotExist
from core.types.input.EntityDescriptionInputType import EntityDescriptionInputType
from graphql_app.LettercraftMutation import LettercraftMutation

from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from space.models import SpaceDescription
from user.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG


class UpdateSpaceInput(EntityDescriptionInputType, InputObjectType):
    id = ID(required=True)
    regions = List(NonNull(ID))
    settlements = List(NonNull(ID))
    structures = List(NonNull(ID))


class UpdateSpaceMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = SpaceDescription

    class Arguments:
        space_data = UpdateSpaceInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, space_data: UpdateSpaceInput):
        try:
            retrieved_object = cls.get_or_create_object(info, space_data)
        except ObjectDoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, errors=[error])  # type: ignore

        space: SpaceDescription = retrieved_object.object  # type: ignore

        if not can_edit_source(info.context.user, space.source):
            error = LettercraftErrorType(
                field="description",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        try:
            cls.mutate_object(space_data, space, info, ["categorisations"])
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        cls.add_contribution(info, space)
        space.save()

        return cls(ok=True, errors=[])  # type: ignore

    @staticmethod
    def add_contribution(info: ResolveInfo, space: SpaceDescription) -> None:
        user = info.context.user
        if user.is_authenticated:
            space.contributors.add(user)
