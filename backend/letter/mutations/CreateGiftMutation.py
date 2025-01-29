from graphene import (
    Field,
    List,
    NonNull,
    ResolveInfo,
    Boolean,
)
from django.db import transaction
from django.core.exceptions import ValidationError

from letter.models import GiftDescription
from letter.types.GiftDescriptionType import GiftDescriptionType
from graphql_app.LettercraftMutation import LettercraftMutation
from graphql_app.types.LettercraftErrorType import LettercraftErrorType
from source.models import Source
from event.models import Episode
from core.types.EntityDescriptionType import CreateEntityDescriptionInput
from source.permissions import can_edit_source

class CreateGiftMutation(LettercraftMutation):
    ok = Boolean(required=True)
    gift = Field(GiftDescriptionType)
    errors = List(NonNull(LettercraftErrorType), required=True)

    django_model = GiftDescription

    class Arguments:
        gift_data = CreateEntityDescriptionInput(required=True)

    @classmethod
    def mutate(
        cls, root: None, info: ResolveInfo, gift_data: CreateEntityDescriptionInput
    ):
        gift = cls.create_object()
        try:
            with transaction.atomic():
                cls.mutate_object(gift_data, gift, info)
                assert can_edit_source(info.context.user, gift.source)
                cls.add_contribution(gift, gift_data, info)
                gift.full_clean()
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
            return cls(ok=False, errors=[error])
        except ValidationError as e:
            errors = [
                LettercraftErrorType(field, messages)
                for field, messages in e.message_dict.items()
            ]
            return cls(ok=False, errors=errors)

        return cls(ok=True, gift=gift, errors=[])

    @staticmethod
    def add_contribution(
        gift: GiftDescription,
        gift_data: CreateEntityDescriptionInput,
        info: ResolveInfo,
    ):
        if info.context:
            user = info.context.user
            gift.contributors.add(user)

            if gift_data.episodes:
                for episode_id in gift_data.episodes:
                    episode = Episode.objects.get(id=episode_id)
                    episode.contributors.add(user)
