from graphene import List, NonNull

from core.models import HistoricalEntity
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType
from core.types.NamedType import NamedType
from user.types.UserType import UserType


class HistoricalEntityType(NamedType, AbstractDjangoObjectType):
    """
    Type for models that extend the HistoricalEntity model.
    Should not be queried directly, but should be extended by other types.
    """

    contributors = List(NonNull(UserType), required=True)

    class Meta:
        model = HistoricalEntity
        fields = [
            "identifiable",
            "contributors",
        ] + NamedType.fields()
