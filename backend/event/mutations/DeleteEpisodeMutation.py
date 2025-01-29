from graphene import ID, Boolean, List, Mutation, NonNull, ResolveInfo

from event.models import Episode
from event.types.EpisodeType import EpisodeType
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.permissions import can_edit_source

class DeleteEpisodeMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        id = ID(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, id: str):
        try:
            episode = EpisodeType.get_queryset(Episode.objects, info).get(id=id)
        except Episode.DoesNotExist:
            error = LettercraftErrorType(field="id", messages=["Episode not found."])
            return cls(ok=False, errors=[error])  # type: ignore

        if not can_edit_source(info.context.user, episode.source):
            error = LettercraftErrorType(
                field="id",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(ok=False, errors=[error])

        episode.delete()
        return cls(ok=True, errors=[])  # type: ignore
