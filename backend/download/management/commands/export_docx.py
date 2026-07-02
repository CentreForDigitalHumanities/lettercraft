from django.core.management.base import BaseCommand
import argparse
from io import TextIOWrapper

from source.models import Source
from download.export_docx import save_docx

class Command(BaseCommand):
    help = '''
    Export all public data to JSON
    '''

    def add_arguments(self, parser):
        parser.add_argument(
            "out",
            type=argparse.FileType("wb"),
        )

    def handle(self, out: TextIOWrapper, *args, **kwargs):
        sources = Source.objects.filter(is_public=True)

        save_docx(sources, out)
        self.stdout.write(self.style.SUCCESS(
            f"DOCX file saved at {out.name}"
        ))
