from typing import Dict
from pathlib import Path
import json

from django.db.models import QuerySet

from source.models import Source
from person.models import AgentDescription
from event.models import Episode
from letter.models import LetterDescription, GiftDescription
from space.models import SpaceDescription

def save_json(sources: QuerySet[Source], path: str | Path) -> None:
    data = _serialize(sources)

    with open(path, 'w') as f:
        json.dump(data, f)


def _serialize(sources: QuerySet[Source]) -> Dict:
    return {
        'sources': [_serialize_source(source) for source in sources]
    }

def _serialize_source(source: Source) -> Dict:
    agents = AgentDescription.objects.filter(source=source).values(
        'id', 'name', 'description', 'is_group'
    )
    letters = LetterDescription.objects.filter(source=source).values(
        'id', 'name', 'description'
    )
    gifts = GiftDescription.objects.filter(source=source).values(
        'id', 'name', 'description',
    )
    locations = SpaceDescription.objects.filter(source=source).values(
        'id', 'name', 'description'
    )

    return {
        'id': source.pk,
        'name': source.name,
        'medieval_title': source.medieval_title,
        'reference': source.reference,
        'description': source.description_text,
        'episodes': [
            _serialize_episode(ep) for ep in
            Episode.objects.filter(source=source).prefetch_related(
                'categories', 'agents', 'gifts', 'letters', 'spaces'
            )
        ],
        'agents': list(agents),
        'letters': list(letters),
        'gifts': list(gifts),
        'locations': list(locations),
    }


def _serialize_episode(episode: Episode) -> Dict:
    return {
        'id': episode.pk,
        'name': episode.name,
        'summary': episode.summary,
        'designators': episode.designators,
        'labels': [label.name for label in episode.categories.all()],
        'agents': [agent.pk for agent in episode.agents.all()],
        'letters': [letter.pk for letter in episode.letters.all()],
        'gifts': [gift.pk for gift in episode.gifts.all()],
        'locations': [space.pk for space in episode.spaces.all()],
    }

