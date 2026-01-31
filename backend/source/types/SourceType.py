from typing import Type, Optional
from graphene import Field, Int, List, NonNull, ResolveInfo, Boolean
from django.db.models import QuerySet, Model, Q
from graphene_django import DjangoObjectType
from django_filters import FilterSet, CharFilter, BooleanFilter

from core.models import EntityDescription
from event.models import Episode
from event.types.EpisodeType import EpisodeType
from letter.models import GiftDescription, LetterDescription
from letter.types.LetterDescriptionType import LetterDescriptionType
from letter.types.GiftDescriptionType import GiftDescriptionType
from person.models import AgentDescription
from person.types.AgentDescriptionType import AgentDescriptionType
from source.models import Source, SourceImage
from source.types.SourceContentsDateType import SourceContentsDateType
from source.types.SourceWrittenDateType import SourceWrittenDateType
from source.types.SourceImageType import SourceImageType
from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType
from user.models import User
from user.types.UserType import UserType
from user.permissions import can_edit_source, visible_condition
from graphql_app.filters import CharInFilter

from source.types.SourceImageType import SourceImageType
from source.utils import source_contributor_ids

class SourceFilter(FilterSet):
    search = CharFilter(method="search_sources")
    label_ids = CharInFilter(method="filter_by_labels")
    is_public = BooleanFilter(field_name="is_public")

    def search_sources(self, queryset: QuerySet[Source], name: str, value: str) -> QuerySet[Source]:
        """Filter sources by by searching through the name, reference, or description."""
        return queryset.filter(
            Q(name__icontains=value)
            | Q(medieval_title__icontains=value)
            | Q(reference__icontains=value)
            | Q(description_text__icontains=value)
        )

    def filter_by_labels(self, queryset: QuerySet[Source], name: str, value: list[str]) -> QuerySet[Source]:
        """Filter sources by categories (labels)."""
        if not value:
            return queryset
        return queryset.filter(episode__categories__id__in=value).distinct()


class SourceType(DjangoObjectType):
    episodes = List(NonNull(EpisodeType), required=True)
    num_of_episodes = Int(required=True)
    written_date = Field(SourceWrittenDateType)
    image = Field(SourceImageType)
    contents_date = Field(SourceContentsDateType)
    agents = List(NonNull(AgentDescriptionType), required=True)
    gifts = List(NonNull(GiftDescriptionType), required=True)
    letters = List(NonNull(LetterDescriptionType), required=True)
    spaces = List(NonNull(SpaceDescriptionType), required=True)
    editable = Boolean(required=True)
    contributors = List(NonNull(UserType), required=True)


    class Meta:
        model = Source
        fields = [
            "id",
            "name",
            "medieval_title",
            "reference",
            "description_text",
            "is_public",
        ]
        filterset_class = SourceFilter

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[Source], info: ResolveInfo
    ) -> QuerySet[Source]:
        user = info.context.user
        return queryset.filter(visible_condition(user)).distinct()

    # It would be proper to decorate _entity_resolver() with @staticmethod,
    # but we are running Python 3.9 on the server, which does not support
    # calling static methods as regular functions, so the tests fail.
    # This is solved in Python 3.10, cf. https://github.com/python/cpython/issues/87848

    # @staticmethod
    def _entity_resolver(
        EntityModel: Type[EntityDescription], OutputType: Type[DjangoObjectType]
    ):
        def resolve(parent: Source, info: ResolveInfo) -> QuerySet[Model]:
            return OutputType.get_queryset(EntityModel.objects, info).filter(
                source__id=parent.pk
            ).distinct()

        return resolve

    resolve_episodes = _entity_resolver(Episode, EpisodeType)
    resolve_agents = _entity_resolver(AgentDescription, AgentDescriptionType)
    resolve_gifts = _entity_resolver(GiftDescription, GiftDescriptionType)
    resolve_letters = _entity_resolver(LetterDescription, LetterDescriptionType)
    resolve_spaces = _entity_resolver(SpaceDescription, SpaceDescriptionType)

    @staticmethod
    def resolve_num_of_episodes(parent: Source, info: ResolveInfo) -> int:
        return SourceType.resolve_episodes(parent, info).count()

    @staticmethod
    def resolve_editable(parent: Source, info: ResolveInfo) -> bool:
        return can_edit_source(info.context.user, parent)

    @staticmethod
    def resolve_contributors(parent: Source, info: ResolveInfo) -> QuerySet[User]:
        user_ids = source_contributor_ids(parent)
        return User.objects.filter(id__in=user_ids)

    @staticmethod
    def resolve_image(parent: Source, info: ResolveInfo) -> Optional[SourceImage]:
        if parent.images.exists():
            return parent.images.first()
