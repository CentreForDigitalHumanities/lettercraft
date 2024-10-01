from graphene import Enum, InputObjectType
from core.models import SourceMention
from core.types.input.FieldInputType import FieldInputType


class DescriptionFieldInputType(FieldInputType, InputObjectType):
    source_mention = Enum.from_enum(SourceMention)()
