from pathlib import Path
import csv
from operator import attrgetter

from django.core.management.base import BaseCommand
from person.models import AgentDescription

class Command(BaseCommand):
    help = """
    Export agent data to CSV.

    This is primarily intended to clean up agent names and assign historical agents
    in other software. After updating the CSV file, use the import_agents command to
    import it.
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "path",
            type=Path,
            help="path of the export file",
        )

    def handle(self, path: Path, *args, **options):
        export_fields = [
            ('id', 'pk'),
            ('name', 'name'),
            ('description', 'description'),
            ('source_id', 'source.pk'),
            ('source_name', 'source.name'),
            ('historical_person', lambda o: o.describes.first().name if o.describes.exists() else '')
        ]
        with open(path, 'w', newline="") as outfile:
            fieldnames = [col for col, _ in export_fields]
            writer = csv.DictWriter(outfile, fieldnames)
            writer.writeheader()

            for agent in AgentDescription.objects.all():
                get = lambda attr : attr if callable(attr) else attrgetter(attr)
                data = {
                    col: get(attr)(agent) for col, attr in export_fields
                }
                writer.writerow(data)
