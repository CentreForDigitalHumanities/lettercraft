from graphene import ObjectType, Int, ResolveInfo, String

from core.models import Field


class LettercraftFieldType(ObjectType):
    """
    Type for models that extend the Field model.
    Should not be queried directly, but should be extended by other types.
    """

    certainty = Int(required=True)
    note = String()

    @staticmethod
    def fields() -> list[str]:
        return [
            "certainty",
            "note",
        ]

    @staticmethod
    def resolve_certainty(parent: Field, info: ResolveInfo) -> int:
        return parent.certainty

    @staticmethod
    def resolve_note(parent: Field, info: ResolveInfo) -> str:
        return parent.note
