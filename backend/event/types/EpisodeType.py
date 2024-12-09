from graphene import List, NonNull, ResolveInfo
from graphene_django import DjangoObjectType
from core.types.EntityDescriptionType import EntityDescriptionType
from django.db.models import QuerySet

from event.models import Episode, EpisodeCategory
from event.types.EpisodeCategoryType import EpisodeCategoryType
from person.models import AgentDescription


class EpisodeType(EntityDescriptionType, DjangoObjectType):
    categories = List(NonNull(EpisodeCategoryType), required=True)
    agents = List(
        NonNull("person.types.AgentDescriptionType.AgentDescriptionType"), required=True
    )

    class Meta:
        model = Episode
        fields = [
            "id",
            "summary",
            "categories",
            "designators",
            "gifts",
            "letters",
            "spaces",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @classmethod
    def get_queryset(
        cls,
        queryset: QuerySet[Episode],
        info: ResolveInfo,
    ) -> QuerySet[Episode]:
        return queryset.all()

    @staticmethod
    def resolve_agents(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[AgentDescription]:
        # Without distinct(), this returns one agent for every HistoricalPerson linked
        # to that agent, for some reason.
        return parent.agents.distinct()

    @staticmethod
    def resolve_categories(
        parent: Episode, info: ResolveInfo
    ) -> QuerySet[EpisodeCategory]:
        return parent.categories.all()
