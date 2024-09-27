from graphene import ID, Field, InputObjectType, List, NonNull, ResolveInfo, String

from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source
from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType


class CreateSpaceInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateSpaceMutation(LettercraftMutation):
    space = Field(SpaceDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = SpaceDescription

    class Arguments:
        space_data = CreateSpaceInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, space_data: CreateSpaceInput):
        try:
            source = Source.objects.get(id=getattr(space_data, "source"))
        except Source.DoesNotExist:
            error = LettercraftErrorType(field="source", messages=["Source not found."])
            return cls(errors=[error])  # type: ignore

        space = SpaceDescription.objects.create(
            name=getattr(space_data, "name"),
            source=source,
        )

        cls.add_contribution(info, space)

        return cls(space=space, errors=[])  # type: ignore

    @staticmethod
    def add_contribution(info: ResolveInfo, space: SpaceDescription) -> None:
        user = info.context.user
        if user.is_authenticated:
            space.contributors.add(user)
