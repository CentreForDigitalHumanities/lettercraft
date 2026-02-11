from django.core.management.base import BaseCommand
import argparse
from io import TextIOWrapper

from source.models import Source
from download.export_json import save_json

class Command(BaseCommand):
    help = '''
    Export all public data to JSON
    '''

    def add_arguments(self, parser):
        parser.add_argument(
            'out',
            type=argparse.FileType('w'),
        )

    def handle(self, out: TextIOWrapper, *args, **kwargs):
        sources = Source.objects.filter(is_public=True)
        save_json(sources, out)
