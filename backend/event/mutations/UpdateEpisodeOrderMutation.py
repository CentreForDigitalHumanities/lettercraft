from graphene import ID, Boolean, InputObjectType, Int, List, Mutation, NonNull, ResolveInfo
from django.db import transaction

from event.models import Episode
from graphql_app.types.LettercraftErrorType import LettercraftErrorType


class EpisodeOrderInput(InputObjectType):
    id = ID(required=True)
    rank = Int(required=True)


class UpdateEpisodeOrderMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        episode_order_data = List(NonNull(EpisodeOrderInput), required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, episode_order_data: list[EpisodeOrderInput]):
        # Map Episode IDs to new rank values
        id_to_rank: dict[int, int] = {
            int(episode.id): episode.rank for episode in episode_order_data
        }

        # Collect relevant episodes
        ids = [episode.id for episode in episode_order_data]
        episodes = list(Episode.objects.filter(id__in=ids))

        for episode in episodes:
            episode.rank = id_to_rank[episode.pk]

        with transaction.atomic():
            Episode.objects.bulk_update(episodes, ['rank'])

        return cls(ok=True, errors=[]) # type: ignore


