from graphene import Field, Int, List, ResolveInfo, NonNull, Boolean
from graphene_django import DjangoObjectType
from django_filters import CharFilter, FilterSet
from django.db.models import QuerySet, Q

from core.types.EntityDescriptionType import EntityDescriptionType
from graphql_app.filters import CharInFilter
from person.models import AgentDescription, HistoricalPerson, PersonReference
from person.types.AgentDescriptionGenderType import AgentDescriptionGenderType
from person.types.AgentDescriptionLocationType import AgentDescriptionLocationType
from person.types.HistoricalPersonType import HistoricalPersonType
from person.types.PersonReferenceType import PersonReferenceType
from event.types.EpisodeAgentType import EpisodeAgentType
from event.models import EpisodeAgent


class AgentDescriptionFilter(FilterSet):
    search = CharFilter(method="search_agent_descriptions")
    label_ids = CharInFilter(method="filter_by_labels")

    def search_agent_descriptions(
        self, queryset: QuerySet[AgentDescription], name: str, value: str
    ) -> QuerySet[AgentDescription]:
        """Filter agent descriptions by name or description."""
        return queryset.filter(
            Q(name__icontains=value) | Q(description__icontains=value)
        )

    def filter_by_labels(
        self, queryset: QuerySet[AgentDescription], name: str, value: list[str]
    ) -> QuerySet[AgentDescription]:
        """Filter agent descriptions by categories (labels)."""
        if not value:
            return queryset
        return queryset.filter(episodes__categories__id__in=value).distinct()


class AgentDescriptionType(EntityDescriptionType, DjangoObjectType):
    describes = List(NonNull(HistoricalPersonType), required=True)
    person_references = List(NonNull(PersonReferenceType), required=True)
    gender = Field(AgentDescriptionGenderType)
    location = Field(AgentDescriptionLocationType)
    episodes = List(NonNull(EpisodeAgentType), required=True)
    identified = Boolean(required=True)

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
        interfaces = EntityDescriptionType._meta.interfaces

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

    @staticmethod
    def resolve_identified(parent: AgentDescription, info: ResolveInfo) -> bool:
        return parent.identified()
