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

from person.types.AgentDescriptionType import AgentDescriptionType
from person.models import (
    AgentDescription,
    Gender,
    AgentDescriptionGender,
    AgentDescriptionLocation,
)
from core.models import SourceMention
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Model


class UpdateAgentGenderInput(InputObjectType):
    gender = Enum.from_enum(Gender)()
    source_mention = Enum.from_enum(SourceMention)()
    note = String()


class UpdateAgentLocationInput(InputObjectType):
    location = ID()
    source_mention = Enum.from_enum(SourceMention)()
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
            cls.mutate_object(
                agent_data,
                agent,
                info,
                excluded_fields=["gender", "location"],
            )
            cls.handle_nested_fields(agent, agent_data, info)

        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error], agent=agent)

        # refresh to load related objects if those were updated
        agent.refresh_from_db()

        return cls(ok=True, errors=[], agent=agent)

    @classmethod
    def handle_nested_fields(
        cls, agent: AgentDescription, agent_data: UpdateAgentInput, info: ResolveInfo
    ):
        cls.mutate_nested_object(
            agent, agent_data, info, "gender", AgentDescriptionGender, "agent"
        )
        cls.mutate_nested_object(
            agent, agent_data, info, "location", AgentDescriptionLocation, "agent"
        )

    @classmethod
    def mutate_nested_object(
        cls,
        agent: AgentDescription,
        agent_data: UpdateAgentInput,
        info: ResolveInfo,
        field_name: str,
        related_model: Model,
        related_name: str,
    ):
        if not field_name in agent_data:
            return

        nested_data = getattr(agent_data, field_name)
        relation = {related_name: agent}

        if nested_data is None:
            related_model.objects.filter(**relation).delete()
        else:
            try:
                related_obj = related_model.objects.get(**relation)
            except:
                # if the object does not exist, construct it but don't yet create in the
                # database. The model may have non-nullable fields that are specified
                # in the data
                related_obj = related_model(**relation)
            cls.mutate_object(nested_data, related_obj, info)
