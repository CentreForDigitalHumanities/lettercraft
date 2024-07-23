from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import Q, QuerySet

from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType


class SpaceQueries(ObjectType):
    space_description = Field(SpaceDescriptionType, id=ID(required=True))
    space_descriptions = List(
        NonNull(SpaceDescriptionType), required=True, source_id=ID()
    )

    @staticmethod
    def resolve_space_description(
        parent: None, info: ResolveInfo, id: str
    ) -> SpaceDescription | None:
        try:
            return SpaceDescriptionType.get_queryset(
                SpaceDescription.objects, info
            ).get(id=id)
        except SpaceDescription.DoesNotExist:
            return None

    @staticmethod
    def resolve_space_descriptions(
        parent: None,
        info: ResolveInfo,
        source_id: str | None = None,
    ) -> QuerySet[SpaceDescription]:
        filters = Q() if source_id is None else Q(source_id=source_id)

        return SpaceDescriptionType.get_queryset(SpaceDescription.objects, info).filter(
            filters
        )
