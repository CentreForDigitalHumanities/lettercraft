from graphene import ID, Boolean, InputObjectType, List, NonNull, ResolveInfo, String
from django.core.exceptions import ObjectDoesNotExist

from core.types.input.EntityDescriptionInputType import EntityDescriptionInputType
from event.models import Episode
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.permissions import can_edit_source


class UpdateEpisodeInput(EntityDescriptionInputType, InputObjectType):
    id = ID(required=True)
    summary = String()
    designators = List(NonNull(String))


class UpdateEpisodeMutation(LettercraftMutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = Episode

    class Arguments:
        episode_data = UpdateEpisodeInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, episode_data: UpdateEpisodeInput):
        try:
            retrieved_object = cls.get_or_create_object(info, episode_data)
        except ObjectDoesNotExist as e:
            error = LettercraftErrorType(field="id", messages=[str(e)])
            return cls(ok=False, errors=[error])  # type: ignore

        episode: Episode = retrieved_object.object  # type: ignore

        if not can_edit_source(info.context.user, episode.source):
            error = LettercraftErrorType(
                field="source",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(errors=[error])

        try:
            cls.mutate_object(episode_data, episode, info)
        except ObjectDoesNotExist as field:
            error = LettercraftErrorType(
                field=str(field), messages=["Related object cannot be found."]
            )
            return cls(ok=False, errors=[error])  # type: ignore

        if info.context:
            user = info.context.user
            episode.contributors.add(user)

        episode.save()

        return cls(ok=True, errors=[])  # type: ignore
