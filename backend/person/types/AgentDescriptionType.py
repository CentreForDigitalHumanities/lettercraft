from graphene import Field, List, ResolveInfo
from graphene_django import DjangoObjectType

from django.db.models import QuerySet
from core.types.EntityDescriptionType import EntityDescriptionType
from person.models import AgentDescription, HistoricalPerson, PersonReference
from person.types.AgentDescriptionGenderType import AgentDescriptionGenderType
from person.types.HistoricalPersonType import HistoricalPersonType
from person.types.PersonReferenceType import PersonReferenceType


class AgentDescriptionType(EntityDescriptionType, DjangoObjectType):
    describes = List(HistoricalPersonType)
    person_references = List(PersonReferenceType)
    gender = Field(AgentDescriptionGenderType)

    class Meta:
        model = AgentDescription
        fields = [
            "id",
            "describes",
            "is_group",
            "person_references",
            "gender",
        ] + EntityDescriptionType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[AgentDescription], info: ResolveInfo
    ) -> QuerySet[AgentDescription]:
        return queryset.all()

    @staticmethod
    def resolve_describes(
        parent: AgentDescription, info: ResolveInfo
    ) -> QuerySet[HistoricalPerson]:
        return parent.describes.all()

    @staticmethod
    def resolve_person_references(
        agent_description: AgentDescription, info: ResolveInfo
    ) -> QuerySet[PersonReference]:
        return agent_description.person_references.all()  # type: ignore
