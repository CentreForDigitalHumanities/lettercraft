import json

from source.models import Source
from download.export_json import save_json

def test_export_json(tmp_path, source, episode):
    path = tmp_path / 'data.json'
    save_json(Source.objects.all(), path)

    with open(path) as f:
        data = json.load(f)


