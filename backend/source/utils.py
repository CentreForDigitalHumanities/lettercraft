from typing import Type, Set
from django.db.models import Model
from source.models import Source

from event.models import Episode
from person.models import AgentDescription
from letter.models import LetterDescription, GiftDescription
from space.models import SpaceDescription

def source_contributor_ids(source: Source) -> Set[int]:
    def contributors_from(Model: Type[Model]) -> Set[int]:
        instances = Model.objects.filter(source=source).prefetch_related('contributors')
        return set(
            contributor.pk
            for instance in instances
            for contributor in instance.contributors.all()
        )

    user_ids = set.union(
        contributors_from(Episode),
        contributors_from(AgentDescription),
        contributors_from(LetterDescription),
        contributors_from(GiftDescription),
        contributors_from(SpaceDescription),
    )

    return user_ids
