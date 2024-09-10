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

        episode = Episode.objects.create(
            name=getattr(episode_data, "name"),
            source=source,
        )
        cls.add_contribution(episode, episode_data, info)

        user = info.context.user
        episode.contributors.add(user)

        return cls(episode=episode, errors=[])  # type: ignore

    def add_contribution(obj: Episode, data: CreateEpisodeInput, info: ResolveInfo):
        user = info.context.user
        obj.contributors.add(user)
