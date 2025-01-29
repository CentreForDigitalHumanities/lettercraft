from graphene import (
    ID,
    Field,
    InputObjectType,
    List,
    NonNull,
    ResolveInfo,
    String,
)

from event.models import Episode
from event.types.EpisodeType import EpisodeType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source
from source.permissions import can_edit_source


class CreateEpisodeInput(InputObjectType):
    name = String(required=True)
    source = ID(required=True)


class CreateEpisodeMutation(LettercraftMutation):
    episode = Field(EpisodeType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = Episode

    class Arguments:
        episode_data = CreateEpisodeInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, episode_data: CreateEpisodeInput):
        try:
            source = Source.objects.get(id=getattr(episode_data, "source"))
        except Source.DoesNotExist:
            error = LettercraftErrorType(field="source", messages=["Source not found."])
            return cls(errors=[error])  # type: ignore

        if not can_edit_source(info.context.user, source):
            error = LettercraftErrorType(
                field="source",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(errors=[error])

        episode = Episode.objects.create(
            name=getattr(episode_data, "name"),
            source=source,
        )
        cls.append_to_source_episode_order(episode)
        cls.add_contribution(episode, episode_data, info)

        user = info.context.user
        episode.contributors.add(user)

        return cls(episode=episode, errors=[])  # type: ignore

    @staticmethod
    def append_to_source_episode_order(episode: Episode) -> None:
        """
        Append the episode ID to the source's episode order.

        This makes sure that the newly created episode is at the bottom of the episode list.
        """
        ordered_episodes = episode.source.get_episode_order()
        episode_ids = list(ordered_episodes.values_list("id", flat=True))
        episode_ids.append(episode.pk)
        episode.source.set_episode_order(episode_ids)

    @staticmethod
    def add_contribution(obj: Episode, data: CreateEpisodeInput, info: ResolveInfo):
        if info.context:
            user = info.context.user
            obj.contributors.add(user)
