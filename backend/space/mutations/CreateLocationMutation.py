from graphene import ID, Field, InputObjectType, List, NonNull, ResolveInfo, String

from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source
from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType


class CreateLocationInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateLocationMutation(LettercraftMutation):
    location = Field(SpaceDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = SpaceDescription

    class Arguments:
        location_data = CreateLocationInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, location_data: CreateLocationInput):
        try:
            source = Source.objects.get(id=getattr(location_data, "source"))
        except Source.DoesNotExist:
            error = LettercraftErrorType(field="source", messages=["Source not found."])
            return cls(errors=[error])  # type: ignore

        location = SpaceDescription.objects.create(
            name=getattr(location_data, "name"),
            source=source,
        )

        cls.add_contribution(info, location)

        return cls(location=location, errors=[])  # type: ignore

    @staticmethod
    def add_contribution(info: ResolveInfo, location: SpaceDescription) -> None:
        user = info.context.user
        if user.is_authenticated:
            location.contributors.add(user)
