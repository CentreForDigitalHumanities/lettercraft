from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo, String

from event.models import Episode
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source


class CreateEpisodeMutationInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateEpisodeMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = Episode

    class Arguments:
        input = CreateEpisodeMutationInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, input: CreateEpisodeMutationInput):
        try:
            source = Source.objects.get(id=getattr(input, "source"))
        except Source.DoesNotExist:
            error = LettercraftErrorType(field="source", messages=["Source not found."])
            return cls(ok=False, errors=[error])  # type: ignore

        Episode.objects.create(
            name=getattr(input, "name"),
            source=source,
        )

        return cls(ok=True)  # type: ignore
