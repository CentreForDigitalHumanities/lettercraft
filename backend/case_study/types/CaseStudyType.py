from graphene import ResolveInfo
from graphene_django import DjangoObjectType
from django.db.models import QuerySet

from case_study.models import CaseStudy


class CaseStudyType(DjangoObjectType):
    class Meta:
        model = CaseStudy

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[CaseStudy], info: ResolveInfo
    ) -> QuerySet[CaseStudy]:
        return queryset.all()
