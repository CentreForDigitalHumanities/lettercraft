from graphene import Enum, NonNull

from core.models import Field, Certainty
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType

CertaintyEnum = Enum.from_enum(Certainty)

class LettercraftFieldType(AbstractDjangoObjectType):
    """
    Type for models that extend the Field model.
    Should not be queried directly, but should be extended by other types.
    """

    certainty = NonNull(CertaintyEnum)

    class Meta:
        model = Field
        fields = [
            "certainty",
            "note",
        ]
