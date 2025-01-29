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
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS
from event.models import EpisodeEntity
from source.permissions import can_edit_source


class UpdateEpisodeEntityLinkInput(InputObjectType):
    entity = ID(required=True)
    episode = ID(required=True)
    entity_type = Entity(required=True)
    source_mention = SourceMentionEnum()
    note = String()
    designators = List(NonNull(String))


class UpdateEpisodeEntityLinkMutation(LettercraftMutation):
    django_model = EpisodeEntity

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

        if not can_edit_source(info.context.user, obj.episode.source):
            error = LettercraftErrorType(
                field="episode",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(ok=False, errors=[error])

        cls.mutate_object(
            data, obj, info, excluded_fields=["entity", "entity_type", "episode"]
        )
        cls.add_contribution(obj, data, info)

        return cls(ok=True, errors=[])

    @staticmethod
    def add_contribution(
        obj: EpisodeEntity,
        data: UpdateEpisodeEntityLinkInput,
        info: ResolveInfo,
    ):
        if info.context:
            user = info.context.user
            obj.episode.contributors.add(user)
            obj.entity.contributors.add(user)
