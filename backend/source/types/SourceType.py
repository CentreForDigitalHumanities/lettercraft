from graphene import Field, Int, List, NonNull, ResolveInfo, Boolean
from django.db.models import QuerySet, Model
from graphene_django import DjangoObjectType
from typing import Type

from event.models import Episode
from source.models import Source
from event.types.EpisodeType import EpisodeType
from source.types.SourceContentsDateType import SourceContentsDateType
from source.types.SourceWrittenDateType import SourceWrittenDateType
from person.models import AgentDescription
from person.types.AgentDescriptionType import AgentDescriptionType
from letter.types.GiftDescriptionType import GiftDescriptionType
from letter.types.LetterDescriptionType import LetterDescriptionType
from letter.models import GiftDescription, LetterDescription
from core.models import EntityDescription
from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType
from user.permissions import can_edit_source
from user.types.UserType import UserType
from user.models import User


class SourceType(DjangoObjectType):
    episodes = List(NonNull(EpisodeType), required=True)
    num_of_episodes = Int(required=True)
    written_date = Field(SourceWrittenDateType)
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
            "medieval_author",
            "edition_title",
            "edition_author",
        ]

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
        users = User.objects.filter(contributed_episodes__source=parent) | \
            User.objects.filter(contributed_agentdescriptions__source=parent) | \
            User.objects.filter(contributed_letterdescriptions__source=parent) | \
            User.objects.filter(contributed_giftdescriptions__source=parent) | \
            User.objects.filter(contributed_spacedescriptions__source=parent)
        return users.distinct()
