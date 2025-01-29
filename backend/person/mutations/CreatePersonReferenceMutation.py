from graphene import (
    ID,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
)

from person.models import PersonReference, HistoricalPerson, AgentDescription
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ValidationError
from django.db import transaction
from source.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG


class CreatePersonReferenceInput(InputObjectType):
    person = ID(required=True)
    description = ID(required=True)


class CreatePersonReferenceMutation(LettercraftMutation):
    django_model = PersonReference

    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        reference_data = CreatePersonReferenceInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, reference_data: CreatePersonReferenceInput
    ):

        if PersonReference.objects.filter(
            person__id=reference_data.person, description__id=reference_data.description
        ).exists():
            return cls(
                ok=False,
                errors=[LettercraftErrorType("person", ["Reference already exists"])],
            )

        try:
            person = HistoricalPerson.objects.get(id=reference_data.person)
        except HistoricalPerson.DoesNotExist as e:
            return cls(
                ok=False,
                errors=[LettercraftErrorType("person", [str(e)])],
            )

        try:
            description = AgentDescription.objects.get(id=reference_data.description)
        except AgentDescription.DoesNotExist as e:
            return cls(
                ok=False,
                errors=[LettercraftErrorType("description", [str(e)])],
            )

        if not can_edit_source(info.context.user, description.source):
            error = LettercraftErrorType(
                field="description",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        try:
            with transaction.atomic():
                description.describes.add(person)
                description.clean()
        except ValidationError as e:
            return cls(
                ok=False, errors=[LettercraftErrorType("description", e.messages)]
            )

        return cls(ok=True, errors=[])
