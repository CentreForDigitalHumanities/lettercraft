from typing import List
from functools import reduce
from operator import or_, and_

from django.db.models import Q

def search_filter(query: str, fields: List[str]) -> Q:
    '''Constructs a Q object for multi-term search through multiple fields'''
    terms = query.split()
    qs = [_term_filter(term, fields) for term in terms]
    return reduce(and_, qs) if len(qs) else Q()


def _term_filter(term: str, fields: List[str]) -> Q:
    '''Constructs a Q object for a single search term through multiple fields'''
    qs = [
        Q(**{f'{field}__icontains': term})
        for field in fields
    ]
    return reduce(or_, qs) if len(qs) else Q()
