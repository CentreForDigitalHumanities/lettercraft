from graphene import ResolveInfo, String, List, NonNull
from graphene_django import DjangoObjectType
from typing import Type

from django.db.models import QuerySet, Model
from user.models import User
from source.models import Source
from event.models import Episode
from person.models import AgentDescription
from letter.models import LetterDescription, GiftDescription
from space.models import SpaceDescription
from case_study.models import CaseStudy


class UserType(DjangoObjectType):
    full_name = String(required=True)
    public_role = String(required=True)
    description = String(required=True)
    contributed_sources = List(NonNull('source.types.SourceType.SourceType'), required=True)
    case_studies = List(NonNull('case_study.types.CaseStudyType.CaseStudyType'), required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
        ]

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[User], info: ResolveInfo
    ) -> QuerySet[User]:
        return queryset.filter(profile__role__isnull=False)

    @staticmethod
    def resolve_contributed_sources(parent: User, info: ResolveInfo) -> QuerySet[Source]:
        def sources_from_contributions(Model: Type[Model]):
            return set(
                obj.source.id
                for obj in Model.objects.filter(contributors=parent)
            )

        source_ids = set.union(
            sources_from_contributions(Episode),
            sources_from_contributions(AgentDescription),
            sources_from_contributions(LetterDescription),
            sources_from_contributions(GiftDescription),
            sources_from_contributions(SpaceDescription),
        )

        return Source.objects.filter(id__in=source_ids)

    @staticmethod
    def resolve_description(parent: User, info: ResolveInfo) -> str:
        return parent.profile.description

    @staticmethod
    def resolve_case_studies(parent: User, info: ResolveInfo) -> QuerySet[CaseStudy]:
        return parent.case_studies.all()
