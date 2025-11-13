from graphene import List, NonNull, ResolveInfo, Boolean
from graphene_django.types import DjangoObjectType
from django.db.models import QuerySet

from core.types.EntityDescriptionType import EntityDescriptionType
from space.models import (
    Region,
    RegionField,
    Settlement,
    SettlementField,
    SpaceDescription,
    Structure,
    StructureField,
)
from space.types.RegionFieldType import RegionFieldType
from space.types.RegionType import RegionType
from space.types.SettlementType import SettlementType
from space.types.StructureType import StructureType
from space.types.SettlementFieldType import SettlementFieldType
from space.types.StructureFieldType import StructureFieldType
from event.types.EpisodeSpaceType import EpisodeSpaceType
from event.models import EpisodeSpace


class SpaceDescriptionType(EntityDescriptionType, DjangoObjectType):
    regions = List(NonNull(RegionType), required=True)
    settlements = List(NonNull(SettlementType), required=True)
    structures = List(NonNull(StructureType), required=True)
    has_identifiable_features = Boolean(required=True)

    region_fields = List(NonNull(RegionFieldType), required=True)
    settlement_fields = List(NonNull(SettlementFieldType), required=True)
    structure_fields = List(NonNull(StructureFieldType), required=True)

    episodes = List(NonNull(EpisodeSpaceType), required=True)

    class Meta:
        model = SpaceDescription
        fields = [
            "id",
            "regions",
            "settlements",
            "structures",
            "episodes",
        ] + EntityDescriptionType.fields()
        interfaces = EntityDescriptionType._meta.interfaces

    @staticmethod
    def resolve_regions(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[Region]:
        return parent.regions.all()

    @staticmethod
    def resolve_settlements(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[Settlement]:
        return parent.settlements.all()

    @staticmethod
    def resolve_structures(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[Structure]:
        return parent.structures.all()

    @staticmethod
    def resolve_region_fields(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[RegionField]:
        return RegionFieldType.get_queryset(RegionField.objects, info).filter(
            space=parent
        )

    @staticmethod
    def resolve_settlement_fields(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[SettlementField]:
        return SettlementFieldType.get_queryset(SettlementField.objects, info).filter(
            space=parent
        )

    @staticmethod
    def resolve_structure_fields(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[StructureField]:
        return StructureFieldType.get_queryset(StructureField.objects, info).filter(
            space=parent
        )

    @staticmethod
    def resolve_episodes(
        parent: SpaceDescription, info: ResolveInfo
    ) -> QuerySet[EpisodeSpace]:
        return EpisodeSpace.objects.filter(space=parent)

    @staticmethod
    def resolve_has_identifiable_features(
        parent: SpaceDescription, info: ResolveInfo
    ) -> Boolean:
        return parent.has_identifiable_features()
