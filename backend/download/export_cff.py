"""
Module to generate a CITATION.cff file for the data export.
"""

from typing import Dict, List
from datetime import date
from io import TextIOWrapper

from django.conf import settings
import yaml

from user.models import User

DATE_FORMAT = "%Y-%m-%d"
SITE_URL = "https://" + settings.HOST
ABSTRACT = """This dataset is created as part of the Lettercraft project and describes epistolary communication in early Medieval literature."""
KEYWORDS = ["digital humanities", "medieval studies"]
LICENSE = "CC-BY-4.0"


def export_cff(out: TextIOWrapper):
    data = citation_data()
    yaml.dump(data)


def citation_data() -> Dict:
    timestamp = date.today().strftime(DATE_FORMAT)
    return {
        "cff-version": "1.2.0",
        "title": "Lettercraft dataset",
        "authors": _authors_data(),
        "date-released": timestamp,
        "url": SITE_URL,
        "abstract": ABSTRACT,
        "keywords": KEYWORDS,
        "licence": LICENSE,
    }


def _authors_data() -> List[Dict]:
    contributors = User.objects.filter(public_role__exists=True).order_by('last_name')
    return [_author_data(user) for user in contributors]


def _author_data(user: User) -> Dict:
    return {
        "family-names": user.last_name,
        "given-names": user.first_name,
    }
