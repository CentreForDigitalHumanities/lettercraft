from graphene import Mutation, Boolean, List, NonNull, ID, ResolveInfo

from event.models import Episode
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source
from source.permissions import can_edit_source, SOURCE_NOT_PERMITTED_MSG

class UpdateEpisodeOrderMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        episode_ids = List(
            NonNull(ID), required=True, description="Ordered list of episode IDs"
        )

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, episode_ids: list[str]):
        if len(episode_ids) == 0:
            error = LettercraftErrorType(
                field="episode_ids", messages=["No episode IDs provided."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        # Check if all episode IDs are valid.
        episodes = Episode.objects.filter(id__in=episode_ids).prefetch_related("source")
        if episodes.count() != len(episode_ids):
            error = LettercraftErrorType(
                field="episode_ids",
                messages=["Not every provided episode ID is valid."],
            )
            return cls(ok=False, errors=[error])  # type: ignore

        corresponding_sources: set[Source] = {episode.source for episode in episodes}

        # Check if there is at least one source for the provided episode IDs.
        # (There should always be.)
        if len(corresponding_sources) == 0:
            error = LettercraftErrorType(
                field="episode_ids", messages=["No source found for given episode IDs."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        # Check if all provided episode IDs belong to the same source.
        if len(corresponding_sources) > 1:
            error = LettercraftErrorType(
                field="episode_ids",
                messages=["The provided episode IDs belong to more than one source."],
            )
            return cls(ok=False, errors=[error])  # type: ignore

        source = corresponding_sources.pop()

        if not can_edit_source(info.context.user, source):
            error = LettercraftErrorType(
                field="episode_ids",
                messages=[SOURCE_NOT_PERMITTED_MSG],
            )
            return cls(ok=False, errors=[error])

        source.set_episode_order(episode_ids)  # type: ignore

        return cls(ok=True, errors=[])  # type: ignore
