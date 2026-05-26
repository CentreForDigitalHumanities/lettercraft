"""
Module to generate a CITATION.cff file for the data export.
"""

from typing import Dict, List
from datetime import datetime
from io import TextIOWrapper

import yaml

from download.export_json import DATE_FORMAT as json_date_format
from user.models import User

DATE_FORMAT = "%Y-%m-%d"
ABSTRACT = """This dataset is created as part of the Lettercraft project and describes epistolary communication in early Medieval literature."""
KEYWORDS = ["digital humanities", "medieval studies"]
LICENSE = "CC-BY-4.0"


def save_cff(data: Dict, out: TextIOWrapper):
    data = citation_data(data)
    yaml.dump(data, out)


def citation_data(data) -> Dict:
    timestamp = datetime.strptime(data["metadata"]["date"], json_date_format).strftime(DATE_FORMAT)
    return {
        "cff-version": "1.2.0",
        "title": "Lettercraft dataset",
        "authors": _authors_data(),
        "date-released": timestamp,
        "url": data["metadata"]["url"],
        "abstract": ABSTRACT,
        "keywords": KEYWORDS,
        "licence": LICENSE,
    }


def _authors_data() -> List[Dict]:
    contributors = User.objects.filter(
        profile__role__isnull=False).order_by("profile__role", "last_name")
    return [_author_data(user) for user in contributors]


def _author_data(user: User) -> Dict:
    data = {
        "family-names": user.last_name,
        "name-particle": user.last_name_prefix,
        "given-names": user.first_name,
    }
    return { key: value for key, value in data.items() if value }
