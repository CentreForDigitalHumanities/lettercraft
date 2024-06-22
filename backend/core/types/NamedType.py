from graphene_django import DjangoObjectType

from core.models import Named
from core.types.AbstractType import AbstractType


class NamedType(AbstractType, DjangoObjectType):
    """
    Type for models that extend the Named model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = Named
        fields = ["name", "description"]
