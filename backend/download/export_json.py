from typing import Dict, List
from pathlib import Path
import json

from django.db.models import QuerySet, Value, CharField
from django.db.models.functions import Concat

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
    agents = _serialize_agents(AgentDescription.objects.filter(source=source))
    letters = _serialize_letters(LetterDescription.objects.filter(source=source))
    gifts = _serialize_gifts(GiftDescription.objects.filter(source=source))
    locations = _serialize_locations(SpaceDescription.objects.filter(source=source))

    return {
        'id': f'sources/{source.pk}',
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
        'agents': agents,
        'letters': letters,
        'gifts': gifts,
        'locations': locations,
    }


def _serialize_episode(episode: Episode) -> Dict:
    return {
        'id': episode.pk,
        'name': episode.name,
        'summary': episode.summary,
        'designators': episode.designators,
        'labels': [label.name for label in episode.categories.all()],
        'agents': [_object_id('agents', agent.pk) for agent in episode.agents.all()],
        'letters': [_object_id('letters', letter.pk) for letter in episode.letters.all()],
        'gifts': [_object_id('gifts', gift.pk) for gift in episode.gifts.all()],
        'locations': [_object_id('locations', space.pk) for space in episode.spaces.all()],
    }


def _serialize_agents(agents: QuerySet[AgentDescription]) -> List[Dict]:
    values = agents.annotate(
        _id=_id_annotation('agents')
    ).values(
        '_id', 'name', 'description', 'is_group'
    )
    return list(values)


def _serialize_letters(letters: QuerySet[LetterDescription]) -> List[Dict]:
    values = letters.annotate(
        _id=_id_annotation('letters')
    ).values(
        '_id', 'name', 'description'
    )
    return list(values)


def _serialize_gifts(gifts: QuerySet[GiftDescription]) -> List[Dict]:
    values = gifts.annotate(
        _id=_id_annotation('gifts')
    ).values(
        '_id', 'name', 'description'
    )
    return list(values)


def _serialize_locations(locations: QuerySet[SpaceDescription]) -> List[Dict]:
    values = locations.annotate(
        _id=_id_annotation('locations')
    ).values(
        '_id', 'name', 'description'
    )
    return list(values)


def _id_annotation(model_name: str):
    '''
    Expression to create ID annotation for queryset, e.g. "agent/1" for
    AgentDescription record
    '''
    return Concat(Value(model_name), Value('/'), 'pk', output_field=CharField())


def _object_id(model_name: str, pk: int) -> str:
    '''
    Create ID string that includes the type, to distinguish between
    types of records.
    '''
    return f'{model_name}/{pk}'
