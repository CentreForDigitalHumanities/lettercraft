from django.core.management.base import BaseCommand
import os
from pathlib import Path
import shutil
from typing import Optional
from django.conf import settings

from source.models import Source
from download.export_json import json_data, save_json, SCHEMA_PATH
from download.export_docx import save_docx
from download.export_cff import save_cff

EXPORT_DIR = settings.MEDIA_ROOT
README_PATH = Path(os.path.dirname(__file__)) / "../../data-readme.md"

class Command(BaseCommand):
    help = """
    Export all public data into a dataset for publication.
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "--label",
            type=str,
            help="Version label for the export",
        )

    def handle(self, label: Optional[str] = None, **kwargs):
        path = Path(EXPORT_DIR) / "data-export"
        if path.exists():
            shutil.rmtree(path)
        os.mkdir(path)
        self.write_data(path, label=label)


    def write_data(self, dir: Path, label: Optional[str] = None) -> None:
        sources = Source.objects.filter(is_public=True)
        data = json_data(sources, label=label)

        shutil.copyfile(README_PATH, dir / "README.md")

        with open(dir / "data.json", "w") as f:
            save_json(data, f,)

        shutil.copyfile(SCHEMA_PATH, dir / "data.schema.json")

        with open(dir / "data.docx", "wb") as f:
            save_docx(data, f)

        with open(dir / "CITATION.cff", "w") as f:
            save_cff(data, f)

