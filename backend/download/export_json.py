from typing import Dict, List, Any
import json
import re
from io import TextIOWrapper
from datetime import date

from django.db.models import QuerySet, Value, CharField
from django.db.models.functions import Concat, JSONObject, NullIf
from django.contrib.postgres.aggregates import ArrayAgg
from django.conf import settings

from source.models import Source
from person.models import AgentDescription
from event.models import Episode
from letter.models import LetterDescription, GiftDescription
from space.models import SpaceDescription
from user.models import User
from source.utils import source_contributor_ids

DATE_FORMAT = "%d-%m-%Y"
SITE_URL = "https://" + settings.HOST


def save_json(sources: QuerySet[Source], f: TextIOWrapper) -> None:
    data = json_data(sources)
    json.dump(data, f, indent=2)


def json_data(sources: QuerySet[Source]) -> Dict:
    data = _serialize(sources)
    cleaned = _clean_serialised_data(data)
    return cleaned

def _serialize(sources: QuerySet[Source]) -> Dict:
    timestamp = date.today().strftime(DATE_FORMAT)
    return {
        "sources": [_serialize_source(source) for source in sources],
        "metadata": {
            "url": SITE_URL,
            "date": timestamp,
        }
    }


def _serialize_source(source: Source) -> Dict:
    agents = _serialize_agents(AgentDescription.objects.filter(source=source))
    letters = _serialize_letters(LetterDescription.objects.filter(source=source))
    gifts = _serialize_gifts(GiftDescription.objects.filter(source=source))
    locations = _serialize_locations(SpaceDescription.objects.filter(source=source))
    episodes = _serialize_episodes(Episode.objects.filter(source=source))

    contributor_ids = source_contributor_ids(source)
    contributors = _serialize_contributors(User.objects.filter(pk__in=contributor_ids))

    return {
        'id': f'sources/{source.pk}',
        'name': source.name,
        'medieval_title': source.medieval_title,
        'reference': source.reference,
        'description': source.description_text,
        'contributors': contributors,
        'episodes': episodes,
        'agents': agents,
        'letters': letters,
        'gifts': gifts,
        'locations': locations,
    }


def _serialize_episodes(episodes: QuerySet[Episode]) -> List[Dict]:
    values = episodes.annotate(
        _id=_id_expression('episodes'),
        source_reference=JSONObject(
            book='book',
            chapter='chapter',
            page='page',
        ),
        labels=ArrayAgg('categories__name', distinct=True),
        _agents=ArrayAgg(_id_expression('agents', 'agents__pk'), distinct=True),
        _letters=ArrayAgg(_id_expression('letters', 'letters__pk'), distinct=True),
        _gifts=ArrayAgg(_id_expression('gifts', 'gifts__pk'), distinct=True),
        locations=ArrayAgg(_id_expression('locations', 'spaces__pk'), distinct=True),
    ).values(
        '_id', 'name', 'summary', 'designators', 'source_reference',
        'labels', '_agents', '_letters', '_gifts', 'locations',
    )
    return list(values)


def _serialize_contributors(users: QuerySet[User]) -> List[Dict]:
    values = users.annotate(
        name=Concat('first_name', Value(' '), 'last_name')
    ).values('name')
    return [value['name'] for value in values]


def _serialize_agents(agents: QuerySet[AgentDescription]) -> List[Dict]:
    values = agents.annotate(
        _id=_id_expression('agents'),
    ).values(
        '_id', 'name', 'description', 'is_group'
    )
    return list(values)


def _serialize_letters(letters: QuerySet[LetterDescription]) -> List[Dict]:
    values = letters.annotate(
        _id=_id_expression('letters')
    ).values(
        '_id', 'name', 'description'
    )
    return list(values)


def _serialize_gifts(gifts: QuerySet[GiftDescription]) -> List[Dict]:
    values = gifts.annotate(
        _id=_id_expression('gifts')
    ).values(
        '_id', 'name', 'description'
    )
    return list(values)


def _serialize_locations(locations: QuerySet[SpaceDescription]) -> List[Dict]:
    values = locations.annotate(
        _id=_id_expression('locations')
    ).values(
        '_id', 'name', 'description'
    )
    return list(values)


def _id_expression(model_name: str, field: str = 'pk'):
    '''
    Expression to create ID annotation for queryset that includes the model name

    Creates IDs like "agent/1" for an AgentDescription record.

    Includes a check to return null if there is no PK value, which happens in ArrayAgg
    when the list is empty.
    '''
    return NullIf(
        Concat(Value(model_name), Value('/'), field, output_field=CharField()),
        Concat(Value(model_name), Value('/')),
    )


def _clean_serialised_data(data: Any) -> Any:
    '''
    Some formatting for data objects. Removes some artifacts from Model lookups.

    - Removes leading `_` from dict keys (used to avoid overlap between annotation names
        and model field names)
    - Filters `None` values from arrays (ArrayAgg returns `[None]` when
        the list is empty)
    - Transform `''` to `None`
    '''

    transform_key = lambda key: re.sub('^_', '', key)

    if isinstance(data, Dict):
        return {
            transform_key(key): _clean_serialised_data(value)
            for key, value in data.items()
        }
    if isinstance(data, List):
        items = filter(lambda x: x is not None, data)
        return [
            _clean_serialised_data(item)
            for item in items
        ]
    if isinstance(data, str):
        return data or None
    return data
