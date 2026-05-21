from django.core.management.base import BaseCommand
import os
from pathlib import Path
import shutil

from source.models import Source
from download.export_json import save_json, SCHEMA_PATH
from download.export_docx import save_docx
from download.export_cff import save_cff

class Command(BaseCommand):
    help = """
    Export all public data to JSON
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "dir",
            type=str,
        )

    def handle(self, dir: str, *args, **kwargs):
        try:
            self.validate(dir)
        except Exception as e:
            self.stderr.write(f"Invalid input: {e}")

        path = Path(dir) / "data-export"
        if path.exists():
            shutil.rmtree(path)
        os.mkdir(path)
        self.write_data(path)


    def validate(self, dir: str) -> None:
        if not os.path.isdir(dir):
            raise NotADirectoryError(f"{dir} is not a directory")

    def write_data(self, dir: Path) -> None:
        sources = Source.objects.filter(is_public=True)

        with open(dir / "data.json", "w") as f:
            save_json(sources, f)

        shutil.copyfile(SCHEMA_PATH, dir / "data.schema.json")

        with open(dir / "data.docx", "wb") as f:
            save_docx(sources, f)

        with open(dir / "CITATION.cff", "w") as f:
            save_cff(f)

