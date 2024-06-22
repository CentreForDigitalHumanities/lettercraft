
from core.models import LettercraftDate
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType


class LettercraftDateType(AbstractDjangoObjectType):
    """
    Type for models that extend the LettercraftDate model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = LettercraftDate
        fields = [
            "year_lower",
            "year_upper",
            "year_exact",
            "display_date",
        ]
