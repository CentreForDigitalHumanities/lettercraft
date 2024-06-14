from graphene import ID, Field, InputObjectType, List, Mutation, ResolveInfo, String

from source.models import Source
from source.types.SourceType import SourceType


class UpdateCreateSourceInput(InputObjectType):
    id = ID()
    name = String(required=True)
    edition_author = String()
    edition_title = String()
    medieval_author = String()
    medieval_title = String()


class UpdateOrCreateSourceMutation(Mutation):
    source = Field(SourceType)
    errors = List(String)

    class Arguments:
        input = UpdateCreateSourceInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, input: UpdateCreateSourceInput):
        source_id = getattr(input, "id", None)

        if source_id:
            try:
                source = SourceType.get_queryset(Source.objects, info).get(pk=source_id)
            except Source.DoesNotExist:
                return cls(errors=["Source not found."])  # type: ignore
        else:
            source = Source()

        for field, value in input.items():  # type: ignore
            setattr(source, field, value)

        source.save()

        return cls(source=source)  # type: ignore
