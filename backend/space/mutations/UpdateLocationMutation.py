from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo
from django.core.exceptions import ObjectDoesNotExist
from core.types.input.DescriptionFieldInputType import DescriptionFieldInputType
from core.types.input.EntityDescriptionInputType import EntityDescriptionInputType
from letter.models import LetterDescription
from graphql_app.LettercraftMutation import LettercraftMutation

from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from space.models import SpaceDescription


class UpdateLocationInput(EntityDescriptionInputType, InputObjectType):
    id = ID(required=True)


class UpdateLocationMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = SpaceDescription

    class Arguments:
        location_data = UpdateLocationInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, location_data: UpdateLocationInput):
        try:
            retrieved_object = cls.get_or_create_object(info, location_data)
        except ObjectDoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, errors=[error])  # type: ignore

        location: SpaceDescription = retrieved_object.object  # type: ignore

        try:
            cls.mutate_object(location_data, location, info, ["categorisations"])
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        cls.add_contribution(info, location)
        location.save()

        return cls(ok=True, errors=[])  # type: ignore

    @staticmethod
    def add_contribution(info: ResolveInfo, location: SpaceDescription) -> None:
        user = info.context.user
        if user.is_authenticated:
            location.contributors.add(user)
