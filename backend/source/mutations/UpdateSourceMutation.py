from graphene import ID, Field, InputObjectType, List, Mutation, ResolveInfo, String

from source.models import Source
from source.types.SourceType import SourceType
from source.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class UpdateSourceInput(InputObjectType):
    id = ID(required=True)
    name = String()
    edition_author = String()
    edition_title = String()
    medieval_author = String()
    medieval_title = String()


class UpdateSourceMutation(Mutation):
    source = Field(SourceType)
    errors = List(String)

    class Arguments:
        source_data = UpdateSourceInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, source_data: UpdateSourceInput):
        source_id = getattr(source_data, "id", None)

        try:
            source = SourceType.get_queryset(Source.objects, info).get(pk=source_id)
        except Source.DoesNotExist:
            return cls(errors=["Source not found."])  # type: ignore

        if not can_edit_source(info.context.user, source):
            return cls(
                errors=[
                    LettercraftErrorType(
                        field=["id"], messages=[SOURCE_NOT_PERMITTED_MSG]
                    )
                ]
            )

        for field, value in source_data.items():  # type: ignore
            setattr(source, field, value)

        source.save()

        return cls(source=source)  # type: ignore
