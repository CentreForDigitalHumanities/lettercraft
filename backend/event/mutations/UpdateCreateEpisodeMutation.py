from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo, String
from django.core.exceptions import ObjectDoesNotExist
from event.models import Episode
from graphql_app.LettercraftMutation import LettercraftMutation

from graphql_app.types.LettercraftErrorType import LettercraftErrorType


# TODO: figure out how to handle required fields. Options:
# - Make optional, rely on frontend validation and raise errors in backend.
# - Always query in frontend, send along with every mutation.


class UpdateCreateEpisodeMutationInput(InputObjectType):
    id = ID()
    name = String()
    book = String()
    chapter = String()
    page = String()
    designators = List(NonNull(String))
    summary = String()
    categories = List(NonNull(ID))


class UpdateCreateEpisodeMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = Episode

    class Arguments:
        input = UpdateCreateEpisodeMutationInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, input: UpdateCreateEpisodeMutationInput
    ):
        try:
            retrieved_object = cls.get_or_create_object(info, input)
        except ObjectDoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, errors=[error])  # type: ignore

        episode = retrieved_object.object

        try:
            cls.mutate_object(input, episode, info)
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        episode.save()

        return cls(ok=True, errors=[])  # type: ignore
