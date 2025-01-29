from graphene import ID, Field, InputObjectType, List, Mutation, ResolveInfo, String

from source.models import Source
from source.types.SourceType import SourceType
from source.permissions import can_edit_source
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


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
        source_data = UpdateCreateSourceInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, source_data: UpdateCreateSourceInput
    ):
        source_id = getattr(source_data, "id", None)

        if source_id:
            try:
                source = SourceType.get_queryset(Source.objects, info).get(pk=source_id)
            except Source.DoesNotExist:
                return cls(errors=["Source not found."])  # type: ignore
        else:
            source = Source()

        if not can_edit_source(info.context.user, source):
            return cls(
                errors=[LettercraftErrorType("Not authorised to edit this source")]
            )

        for field, value in source_data.items():  # type: ignore
            setattr(source, field, value)

        source.save()

        return cls(source=source)  # type: ignore
