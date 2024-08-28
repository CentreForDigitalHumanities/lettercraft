from graphene import (
    ID,
    String,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Enum,
)

from person.models import (
    PersonReference,
)
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from core.models import Certainty


class UpdatePersonReferenceInput(InputObjectType):
    id = ID(required=True)
    certainty = Enum.from_enum(Certainty)()
    note = String()


class UpdatePersonReferenceMutation(LettercraftMutation):
    django_model = PersonReference

    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        reference_data = UpdatePersonReferenceInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, reference_data: UpdatePersonReferenceInput
    ):
        try:
            reference = cls.get_object(info, reference_data)
        except PersonReference.DoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, error=[error])

        cls.mutate_object(reference_data, reference, info)

        return cls(ok=True, errors=[])
