from graphene import (
    ID,
    String,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
)

from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from core.types.DescriptionFieldType import SourceMentionEnum
from event.models import EpisodeAgent
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS


class UpdateEpisodeEntityLinkInput(InputObjectType):
    entity = ID(required=True)
    episode = ID(required=True)
    entity_type = Entity(required=True)
    source_mention = SourceMentionEnum()
    note = String()


class UpdateEpisodeEntityLinkMutation(LettercraftMutation):
    django_model = EpisodeAgent

    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        data = UpdateEpisodeEntityLinkInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, data: UpdateEpisodeEntityLinkInput):
        LinkModel = ENTITY_MODELS[data.entity_type]
        link_data = {data.entity_type.value: data.entity, "episode": data.episode}

        try:
            obj = LinkModel.objects.get(**link_data)
        except LinkModel.DoesNotExist:
            return cls(
                ok=False,
                errors=LettercraftErrorType(
                    "episode", ["Relation object does not exist"]
                ),
            )

        cls.mutate_object(
            data, obj, info, excluded_fields=["entity", "entity_type", "episode"]
        )

        return cls(ok=True, errors=[])