from pathlib import Path
import csv
from operator import attrgetter

from django.core.management.base import BaseCommand
from django.db.transaction import atomic

from person.models import AgentDescription, HistoricalPerson, PersonReference

class Command(BaseCommand):
    help = """
    Import agent data from CSV.
    The CSV format should be the same as the export_agents output. Source data
    is included in the output file for clarity but will be ignored here.
    """

    def add_arguments(self, parser):
        parser.add_argument(
            "path",
            type=Path,
            help="path of the import file",
        )

    def handle(self, path: Path, *args, **options):
        with open(path) as infile:
            reader = csv.DictReader(infile)

            with atomic():
                for row in reader:
                    agent = AgentDescription.objects.get(id=row['id'])
                    agent.name = row['name']
                    agent.description = row['description']
                    agent.save()

                    PersonReference.objects.filter(description=agent).delete()

                    if person_name := row['historical_person']:
                        person, _ = HistoricalPerson.objects.get_or_create(name=person_name)
                        agent.describes.add(person)
