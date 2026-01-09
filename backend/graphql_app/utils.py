from typing import List
from functools import reduce
from operator import or_

from django.db.models import Q

def search_filter(query: str, fields: List[str]) -> Q:
    '''Constructs a Q object for string search through multiple fields'''
    terms = query.split()
    qs = [
        Q(**{f'{field}__icontains': term})
        for field in fields
        for term in terms
    ]
    return reduce(or_, qs) if len(qs) else Q()
