from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import Q, QuerySet
from typing import Optional

from space.models import Region, Settlement, SpaceDescription, Structure
from space.types.RegionType import RegionType
from space.types.SettlementType import SettlementType
from space.types.SpaceDescriptionType import SpaceDescriptionType
from space.types.StructureType import StructureType


class SpaceQueries(ObjectType):
    space_description = Field(SpaceDescriptionType, id=ID(required=True))
    space_descriptions = List(
        NonNull(SpaceDescriptionType), required=True, source_id=ID()
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
    ) -> QuerySet[SpaceDescription]:
        filters = Q() if source_id is None else Q(source_id=source_id)

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
