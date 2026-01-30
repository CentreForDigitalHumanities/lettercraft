from django_filters import BaseInFilter, CharFilter


class CharInFilter(BaseInFilter, CharFilter):
    """
    Allows filtering by a list of strings in a CharField.
    """
    pass
