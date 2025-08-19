import csv
from django.db.models import QuerySet
from collections import Counter
from itertools import chain

from event.models import Episode

def count_designators(episodes: QuerySet[Episode]):
    return Counter(chain(*(episode.designators for episode in episodes)))


def export_designators(episodes: QuerySet[Episode], f):
    writer = csv.DictWriter(f, ['designator', 'count'])
    writer.writeheader()
    data = count_designators(episodes)
    for designator, count in data.items():
        writer.writerow({'designator': designator, 'count': count})
