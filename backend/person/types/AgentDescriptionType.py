from graphene import Field, List, ResolveInfo, NonNull
from graphene_django import DjangoObjectType

from django.db.models import QuerySet
from core.types.EntityDescriptionType import EntityDescriptionType
from person.models import AgentDescription, HistoricalPerson, PersonReference
from person.types.AgentDescriptionGenderType import AgentDescriptionGenderType
from person.types.AgentDescriptionLocationType import AgentDescriptionLocationType
from person.types.HistoricalPersonType import HistoricalPersonType
from person.types.PersonReferenceType import PersonReferenceType
from event.types.EpisodeAgentType import EpisodeAgentType
from event.models import EpisodeAgent
from core.types.entity import EntityInterface


class AgentDescriptionType(EntityDescriptionType, DjangoObjectType):
    describes = List(NonNull(HistoricalPersonType), required=True)
    person_references = List(NonNull(PersonReferenceType), required=True)
    gender = Field(AgentDescriptionGenderType)
    location = Field(AgentDescriptionLocationType)
    episodes = List(NonNull(EpisodeAgentType), required=True)

    class Meta:
        model = AgentDescription
        fields = [
            "id",
            "describes",
            "is_group",
            "person_references",
            "gender",
            "location",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = (EntityInterface,)

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
        parent: AgentDescription, info: ResolveInfo
    ) -> QuerySet[PersonReference]:
        return PersonReference.objects.filter(description=parent)

    @staticmethod
    def resolve_episodes(
        parent: AgentDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeAgent]:
        return EpisodeAgent.objects.filter(agent=parent)
