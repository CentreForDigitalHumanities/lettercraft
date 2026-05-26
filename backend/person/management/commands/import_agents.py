from pathlib import Path
import csv
from typing import Dict

from django.core.management.base import BaseCommand
from django.db.transaction import atomic

from person.models import AgentDescription, HistoricalPerson, PersonReference

class Cancelled(Exception):
    pass

class Command(BaseCommand):
    help = """
    Import agent data from CSV.

    The CSV format should be the same as the export_agents output. The export/import
    workflow is intended to correct or enrich metadata for existing agents. The import
    cannot be used to create or remove agents; all agents in the file must match
    an existing agent in the database. Agents that are in the database but not in the
    CSV data, will be left as-is.

    Source data is included in the output file as context, but will be ignored here.
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

            try:
                with atomic():
                    updated = 0
                    total = 0

                    for row in reader:
                        total += 1

                        agent = AgentDescription.objects.get(id=row['id'])

                        agent_updated = self._is_updated(agent, row)

                        if agent_updated:
                            updated += 1
                            self._update(agent, row)

                    print(f'{updated} out of {total} agents will be updated.')
                    response = input('Continue? (y/n)\n')
                    if response not in ['y', 'yes']:
                        raise Cancelled()
                    print('Action confirmed.')

            except Cancelled:
                print('Action cancelled. Database transactions rolled back.')

    def _is_updated(self, agent: AgentDescription, row: Dict):
        return row['name'] or \
            agent.description != row['description'] or \
            agent.describes.exists() and agent.describes.first().name != row['historical_person'] or \
            (not agent.describes.exists()) and row['historical_person']

    def _update(self, agent: AgentDescription, row: Dict):
        agent.name = row['name']
        agent.description = row['description']
        agent.save()

        PersonReference.objects.filter(description=agent).delete()

        if person_name := row['historical_person']:
            person, _ = HistoricalPerson.objects.get_or_create(name=person_name)
            agent.describes.add(person)
