from graphene import (
    Field,
    List,
    NonNull,
    ResolveInfo,
    Boolean,
)
from django.db import transaction
from django.core.exceptions import ValidationError

from space.models import SpaceDescription
from space.types.SpaceDescriptionType import SpaceDescriptionType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source
from event.models import Episode
from core.types.EntityDescriptionType import CreateEntityDescriptionInput
from source.permissions import can_edit_source

class CreateSpaceMutation(LettercraftMutation):
    ok = Boolean(required=True)
    space = Field(SpaceDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = SpaceDescription

    class Arguments:
        space_data = CreateEntityDescriptionInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, space_data: CreateEntityDescriptionInput
    ):
        space = cls.create_object()
        try:
            with transaction.atomic():
                cls.mutate_object(space_data, space, info)
                assert can_edit_source(info.context.user, space.source)
                cls.add_contribution(space, space_data, info)
                space.full_clean()
        except Source.DoesNotExist as e:
            error = LettercraftErrorType(field="source", messages=[e.args[0]])
            return cls(ok=False, errors=[error])  # type: ignore
        except Episode.DoesNotExist as e:
            error = LettercraftErrorType(field="episodes", messages=[e.args[0]])
            return cls(ok=False, errors=[error])
        except AssertionError:
            error = LettercraftErrorType(
                field="source",
                messages=["Not authorised to edit data related to this source"],
            )
            return cls(errors=[error])
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, errors=errors)

        return cls(ok=True, space=space, errors=[])

    @staticmethod
    def add_contribution(
        space: SpaceDescription,
        space_data: CreateEntityDescriptionInput,
        info: ResolveInfo,
    ):
        if info.context:
            user = info.context.user
            space.contributors.add(user)

            if space_data.episodes:
                for episode_id in space_data.episodes:
                    episode = Episode.objects.get(id=episode_id)
                    episode.contributors.add(user)
