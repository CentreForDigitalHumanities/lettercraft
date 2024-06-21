from graphene import Boolean, ObjectType

from core.types.NamedType import NamedType


class HistoricalEntityType(NamedType, ObjectType):
    """
    Type for models that extend the HistoricalEntity model.
    Should not be queried directly, but should be extended by other types.
    """

    identifiable = Boolean(required=True)

    @staticmethod
    def fields() -> list[str]:
        return [
            "id",
            "created_at",
            "updated_at",
        ] + NamedType.fields()
