import json
import re

from source.models import Source
from download.export_json import save_json


def test_export_json(tmp_path, source: Source, episode, episode_2, episode_attribution):
    path = tmp_path / 'data.json'
    qs = Source.objects.filter(pk=source.pk)
    with open(path, 'w') as f:
        save_json(qs, f)

    with open(path) as f:
        data = json.load(f)

    assert len(data['sources']) == 1
    source_data = data['sources'][0]
    assert source_data['name'] == source.name
    assert source_data['description'] is None
    assert len(source_data['episodes']) == 2
    assert source_data['contributors'] == ['John Doe']

    episode_data = source_data['episodes'][0]
    assert len(episode_data['agents']) == 2
    assert re.match(r'agents/\d+$', episode_data['agents'][0])

    assert len(source_data['agents'])  == 2
    assert len(source_data['letters']) == 1
    assert re.match(r'letters/\d+$', source_data['letters'][0]['id'])
    assert source_data['letters'][0]['name']
