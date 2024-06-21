from graphene import ResolveInfo
from graphene_django import DjangoObjectType

from django.db.models import QuerySet
from core.types.EntityDescriptionType import EntityDescriptionType
from person.models import AgentDescription


class AgentDescriptionType(EntityDescriptionType, DjangoObjectType):
    class Meta:
        model = AgentDescription
        fields = [
            "id",
            "describes",
            "is_group",
        ] + EntityDescriptionType.fields()

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[AgentDescription], info: ResolveInfo
    ) -> QuerySet[AgentDescription]:
        return queryset.all()
