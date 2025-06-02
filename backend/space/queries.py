from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo, Boolean
from django.db.models import Q, QuerySet
from typing import Optional

from space.models import Region, Settlement, SpaceDescription, Structure
from space.types.RegionType import RegionType
from space.types.SettlementType import SettlementType
from space.types.SpaceDescriptionType import SpaceDescriptionType
from space.types.StructureType import StructureType
from user.models import User
from user.permissions import editable_sources


class SpaceQueries(ObjectType):
    space_description = Field(
        SpaceDescriptionType,
        id=ID(required=True),
        editable=Boolean(
            description="Only select space descriptions from sources that are editable by the user."
        ),
    )
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
        parent: None, info: ResolveInfo, id: str, editable=False
    ) -> Optional[SpaceDescription]:
        try:
            space_description = SpaceDescriptionType.get_queryset(
                SpaceDescription.objects, info
            ).get(id=id)
        except SpaceDescription.DoesNotExist:
            return None

        user: User = info.context.user

        if user.is_anonymous:
            return None

        # Always return the requested object if the user can edit it.
        if user.is_superuser or user.can_edit_source(space_description.source):
            return space_description

        # The user cannot edit this object
        # and the query only asks for editable objects.
        if editable:
            return None

        # Return non-editable objects iff their source is public.
        return space_description if space_description.source.is_public else None

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
