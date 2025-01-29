from graphene import (
    ID,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
    Mutation,
)

from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS
from event.models import EpisodeEntity
from source.permissions import can_edit_source

class DeleteEpisodeEntityLinkMutation(Mutation):
    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        entity = ID(required=True)
        episode = ID(required=True)
        entity_type = Entity(required=True)

    @classmethod
    def mutate(
        cls,
        root: None,
        info: ResolveInfo,
        entity: ID,
        episode: ID,
        entity_type: Entity,
    ):
        LinkModel = ENTITY_MODELS[entity_type]
        link_data = {entity_type.value: entity, "episode": episode}

        try:
            obj = LinkModel.objects.get(**link_data)
        except LinkModel.DoesNotExist:
            return cls(
                ok=False,
                errors=LettercraftErrorType(
                    "episode", ["Relation object does not exist"]
                ),
            )

        if not can_edit_source(info.context.user, obj.episode.source):
            error = LettercraftErrorType(
                field="episode",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(errors=[error])

        obj.delete()

        return cls(ok=True, errors=[])

    @staticmethod
    def add_contribution(obj: EpisodeEntity, info: ResolveInfo):
        if info.context:
            user = info.context.user
            obj.episode.contributors.add(user)
            obj.entity.contributors.add(user)
