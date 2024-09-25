from graphene import (
    ID,
    InputObjectType,
    Boolean,
    ResolveInfo,
    List,
    NonNull,
)

from event.models import Episode, EpisodeEntity
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from django.core.exceptions import ValidationError
from django.db import transaction
from core.types.entity import Entity
from core.entity_models import ENTITY_MODELS


class CreateEpisodeEntityLinkInput(InputObjectType):
    entity = ID(required=True)
    episode = ID(required=True)
    entity_type = Entity(required=True)


class CreateEpisodeEntityLinkMutation(LettercraftMutation):
    django_model = EpisodeEntity

    ok = Boolean(required=True)
    errors = List(NonNull(LettercraftErrorType), required=True)

    class Arguments:
        data = CreateEpisodeEntityLinkInput(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, data: CreateEpisodeEntityLinkInput):
        LinkModel = ENTITY_MODELS[data.entity_type]
        link_data = {data.entity_type.value: data.entity, "episode": data.episode}

        if LinkModel.objects.filter(**link_data).exists():
            return cls(
                ok=False,
                errors=[LettercraftErrorType("entity", ["Link already exists"])],
            )

        try:
            episode = Episode.objects.get(id=data.episode)
        except Episode.DoesNotExist as e:
            return cls(
                ok=False,
                errors=[LettercraftErrorType("episode", [str(e)])],
            )

        EntityModel = getattr(LinkModel, LinkModel.entity_field).field.related_model

        try:
            entity = EntityModel.objects.get(id=data.entity)
        except EntityModel.DoesNotExist as e:
            return cls(
                ok=False,
                errors=[LettercraftErrorType("entity", [str(e)])],
            )

        try:
            with transaction.atomic():
                obj = LinkModel.objects.create(
                    **{"episode": episode, LinkModel.entity_field: entity}
                )
                obj.clean()
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, errors=errors)

        return cls(ok=True, errors=[])
