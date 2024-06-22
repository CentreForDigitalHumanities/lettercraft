from graphene import Boolean, ObjectType

from core.models import HistoricalEntity
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType
from core.types.NamedType import NamedType


class HistoricalEntityType(NamedType, AbstractDjangoObjectType):
    """
    Type for models that extend the HistoricalEntity model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = HistoricalEntity
        fields = [
            "identifiable",
        ] + NamedType.fields()
