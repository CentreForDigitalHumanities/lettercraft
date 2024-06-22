from core.models import Named
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType


class NamedType(AbstractDjangoObjectType):
    """
    Type for models that extend the Named model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = Named
        fields = ["name", "description"]
