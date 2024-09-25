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

        obj.delete()

        return cls(ok=True, errors=[])
