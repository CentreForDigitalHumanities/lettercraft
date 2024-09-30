from graphene import (
    ID,
    String,
    InputObjectType,
    Boolean,
    ResolveInfo,
    Field,
    List,
    Enum,
    NonNull,
)
from typing import Union
from person.types.AgentDescriptionType import AgentDescriptionType
from person.models import AgentDescription, Gender
from core.models import SourceMention
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import transaction
from django.db.models.fields.related_descriptors import (
    ReverseOneToOneDescriptor,
    ForwardOneToOneDescriptor,
)
from core.types.DescriptionFieldType import SourceMentionEnum

class UpdateAgentGenderInput(InputObjectType):
    gender = Enum.from_enum(Gender)()
    source_mention = SourceMentionEnum()
    note = String()


class UpdateAgentLocationInput(InputObjectType):
    location = ID()
    source_mention = SourceMentionEnum()
    note = String()


class UpdateAgentInput(InputObjectType):
    id = ID(required=True)
    name = String()
    description = String()
    is_group = Boolean()
    designators = List(String)
    gender = UpdateAgentGenderInput()
    location = UpdateAgentLocationInput()


class UpdateAgentMutation(LettercraftMutation):
    django_model = AgentDescription

    ok = Boolean(required=True)
    agent = Field(AgentDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        agent_data = UpdateAgentInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, agent_data: UpdateAgentInput):
        try:
            agent = cls.get_object(info, agent_data)
        except AgentDescription.DoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, error=[error])

        try:
            with transaction.atomic():
                cls.mutate_object(
                    agent_data,
                    agent,
                    info,
                    excluded_fields=["gender", "location"],
                )
                cls.handle_nested_fields(agent, agent_data, info)
                cls.add_contribution(agent, agent_data, info)
                # refresh to load related objects if those were updated through nested
                # fields
                agent.refresh_from_db()
                agent.full_clean()
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error], agent=agent)
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, agent=None, errors=errors)

        return cls(ok=True, errors=[], agent=agent)

    @classmethod
    def handle_nested_fields(
        cls, agent: AgentDescription, agent_data: UpdateAgentInput, info: ResolveInfo
    ):
        cls.mutate_nested_object(
            agent, agent_data, info, "gender", AgentDescription.gender
        )
        cls.mutate_nested_object(
            agent, agent_data, info, "location", AgentDescription.location
        )

    @classmethod
    def mutate_nested_object(
        cls,
        agent: AgentDescription,
        agent_data: UpdateAgentInput,
        info: ResolveInfo,
        field_name: str,
        descriptor: Union[ForwardOneToOneDescriptor, ReverseOneToOneDescriptor],
    ):

        if not field_name in agent_data:
            return

        if isinstance(descriptor, ForwardOneToOneDescriptor):
            related_model = descriptor.field.related_model
            related_name = descriptor.field.related_query_name()
        else:
            related_model = descriptor.related.field.model
            related_name = descriptor.related.field.name

        relation = {related_name: agent}
        nested_data = getattr(agent_data, field_name)

        if nested_data is None:
            related_model.objects.filter(**relation).delete()
        else:
            try:
                related_obj = related_model.objects.get(**relation)
            except related_model.DoesNotExist:
                # if the object does not exist, construct it but don't yet create in the
                # database. The model may have non-nullable fields that are specified
                # in the data
                related_obj = related_model(**relation)
            cls.mutate_object(nested_data, related_obj, info)
            related_obj.full_clean()

    @staticmethod
    def add_contribution(
        agent: AgentDescription, agent_data: UpdateAgentInput, info: ResolveInfo
    ):
        if info.context:
            user = info.context.user
            agent.contributors.add(user)
