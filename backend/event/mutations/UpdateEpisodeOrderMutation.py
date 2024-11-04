from graphene import Mutation, Boolean, List, NonNull, ID, ResolveInfo

from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source


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
            error=LettercraftErrorType(
                field="episode_ids",
                messages=["No episode IDs provided."]
            )
            return cls(ok=False, errors=[error]) # type: ignore

        corresponding_sources = Source.objects.filter(episode__in=episode_ids)
        if corresponding_sources.count() != len(episode_ids):
            error = LettercraftErrorType(
                field="episode_ids",
                messages=["Not every episode has a corresponding source."]
            )
            return cls(ok=False, errors=[error]) # type: ignore

        distinct_sources = corresponding_sources.distinct()
        if distinct_sources.count() > 1:
            error = LettercraftErrorType(
                field="episode_ids",
                messages=["The provided episode IDs belong to more than one source."],
            )
            return cls(ok=False, errors=[error])  # type: ignore

        source = distinct_sources.first()
        if not source:
            error = LettercraftErrorType(
                field="episode_ids",
                messages=["No source found for given episode IDs."],
            )
            return cls(ok=False, errors=[error])  # type: ignore

        source.set_episode_order(episode_ids)  # type: ignore

        return cls(ok=True, errors=[])  # type: ignore
