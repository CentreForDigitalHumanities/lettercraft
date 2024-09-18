from graphene import (
    ID,
    Field,
    InputObjectType,
    List,
    NonNull,
    ResolveInfo,
    String,
)

from letter.models import GiftDescription
from letter.types.GiftDescriptionType import GiftDescriptionType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source


class CreateGiftInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateGiftMutation(LettercraftMutation):
    gift = Field(GiftDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = GiftDescription

    class Arguments:
        gift_data = CreateGiftInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, gift_data: CreateGiftInput):
        try:
            source = Source.objects.get(id=getattr(gift_data, "source"))
        except Source.DoesNotExist:
            error = LettercraftErrorType(field="source", messages=["Source not found."])
            return cls(errors=[error])  # type: ignore

        letter = GiftDescription.objects.create(
            name=getattr(gift_data, "name"),
            source=source,
        )

        return cls(Letter=letter, errors=[])  # type: ignore
