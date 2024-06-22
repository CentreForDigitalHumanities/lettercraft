from core.models import Field
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType


class LettercraftFieldType(AbstractDjangoObjectType):
    """
    Type for models that extend the Field model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = Field
        fields = [
            "certainty",
            "note",
        ]
