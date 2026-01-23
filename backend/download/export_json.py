from typing import Dict
from pathlib import Path
import json

from django.db.models import QuerySet

from source.models import Source

def save_json(sources: QuerySet[Source], path: str | Path) -> None:
    data = _serialize(sources)

    with open(path, 'w') as f:
        json.dump(data, f)


def _serialize(sources: QuerySet[Source]) -> Dict:
    return {}
