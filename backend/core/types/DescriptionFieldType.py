from graphene import ObjectType, ResolveInfo
from core.models import DescriptionField
from core.types.EntityDescriptionType import GQLSourceMention
from core.types.FieldType import LettercraftFieldType


class DescriptionFieldType(LettercraftFieldType, ObjectType):
    """
    Type for models that extend the DescriptionField model.
    Should not be queried directly, but should be extended by other types.
    """

    source_mention = GQLSourceMention()

    @staticmethod
    def fields() -> list[str]:
        return [
            "source_mention",
        ] + LettercraftFieldType.fields()

    @staticmethod
    def resolve_source_mention(parent: DescriptionField, info: ResolveInfo) -> str:
        return parent.source_mention
