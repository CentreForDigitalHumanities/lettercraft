import json

from source.models import Source
from download.export_json import save_json


def test_export_json(tmp_path, source: Source, episode, episode_2):
    path = tmp_path / 'data.json'
    qs = Source.objects.filter(pk=source.pk)
    save_json(qs, path)

    with open(path) as f:
        data = json.load(f)

    assert len(data['sources']) == 1
    source_data = data['sources'][0]
    assert source_data['name'] == source.name
    assert len(source_data['episodes']) == 2

    assert len(source_data['agents'])  == 2
    assert len(source_data['letters']) == 1
    assert source_data['letters'][0]['name'] == 'Bert\'s letter'

