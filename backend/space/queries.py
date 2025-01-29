from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean
from django.db.models import Q, QuerySet
from typing import Optional

from space.models import Region, Settlement, SpaceDescription, Structure
from space.types.RegionType import RegionType
from space.types.SettlementType import SettlementType
from space.types.SpaceDescriptionType import SpaceDescriptionType
from space.types.StructureType import StructureType
from source.permissions import editable_sources


class SpaceQueries(ObjectType):
    space_description = Field(SpaceDescriptionType, id=ID(required=True))
    space_descriptions = List(
        NonNull(SpaceDescriptionType),
        required=True,
        source_id=ID(),
        editable=Boolean(),
    )
    regions = List(NonNull(RegionType), required=True)
    settlements = List(NonNull(SettlementType), required=True)
    structures = List(NonNull(StructureType), required=True)

    @staticmethod
    def resolve_space_description(
        parent: None, info: ResolveInfo, id: str
    ) -> Optional[SpaceDescription]:
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
        source_id: Optional[str] = None,
        editable: bool = False,
    ) -> QuerySet[SpaceDescription]:
        filters = Q()

        if source_id is not None:
            filters &= Q(source_id=source_id)
        if editable:
            user = info.context.user
            filters &= Q(source__in=editable_sources(user))

        return SpaceDescriptionType.get_queryset(SpaceDescription.objects, info).filter(
            filters
        )

    @staticmethod
    def resolve_regions(parent: None, info: ResolveInfo) -> QuerySet[Region]:
        return RegionType.get_queryset(Region.objects, info).all()

    @staticmethod
    def resolve_settlements(parent: None, info: ResolveInfo) -> QuerySet[Settlement]:
        return SettlementType.get_queryset(Settlement.objects, info).all()

    @staticmethod
    def resolve_structures(parent: None, info: ResolveInfo) -> QuerySet[Structure]:
        return StructureType.get_queryset(Structure.objects, info).all()
