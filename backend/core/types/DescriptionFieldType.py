from graphene import Enum, NonNull

from core.models import DescriptionField, SourceMention
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType
from core.types.FieldType import LettercraftFieldType

SourceMentionEnum = Enum.from_enum(SourceMention)

class DescriptionFieldType(LettercraftFieldType, AbstractDjangoObjectType):
    """
    Type for models that extend the DescriptionField model.
    Should not be queried directly, but should be extended by other types.
    """

    source_mention = NonNull(SourceMentionEnum)

    class Meta:
        model = DescriptionField
        fields = [
            "source_mention",
        ] + LettercraftFieldType.fields()
