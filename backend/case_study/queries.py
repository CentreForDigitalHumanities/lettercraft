from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo

from case_study.models import CaseStudy
from case_study.types.CaseStudyType import CaseStudyType

class CaseStudyQueries(ObjectType):
    case_study = Field(CaseStudyType, id=ID(required=True))

    case_studies = List(
        NonNull(CaseStudyType),
        required=True,
    )

    @staticmethod
    def resolve_case_studies(
        parent: None, info: ResolveInfo
    ):
        return CaseStudyType.get_queryset(CaseStudy.objects, info)

    @staticmethod
    def resolve_case_study(
        parent: None, info: ResolveInfo, id: str
    ):
        try:
            return CaseStudyType.get_queryset(CaseStudy.objects, info).get(
                id=id
            )
        except CaseStudy.DoesNotExist:
            return None
