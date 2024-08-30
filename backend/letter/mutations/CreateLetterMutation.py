from graphene import (
    ID,
    Field,
    InputObjectType,
    List,
    NonNull,
    ResolveInfo,
    String,
)

from letter.models import LetterDescription
from letter.types.LetterDescriptionType import LetterDescriptionType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source


class CreateLetterInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateLetterMutation(LettercraftMutation):
    letter = Field(LetterDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = LetterDescription

    class Arguments:
        letter_data = CreateLetterInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, Letter_data: CreateLetterInput):
        try:
            source = Source.objects.get(id=getattr(Letter_data, "source"))
        except Source.DoesNotExist:
            error = LettercraftErrorType(field="source", messages=["Source not found."])
            return cls(errors=[error])  # type: ignore

        letter = LetterDescription.objects.create(
            name=getattr(Letter_data, "name"),
            source=source,
        )

        return cls(Letter=letter, errors=[])  # type: ignore
