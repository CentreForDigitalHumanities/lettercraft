from core.models import DescriptionField
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType
from core.types.FieldType import LettercraftFieldType


class DescriptionFieldType(LettercraftFieldType, AbstractDjangoObjectType):
    """
    Type for models that extend the DescriptionField model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = DescriptionField
        fields = [
            "source_mention",
        ] + LettercraftFieldType.fields()
