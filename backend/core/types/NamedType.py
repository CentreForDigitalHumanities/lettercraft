from graphene import ObjectType, ResolveInfo, String

from core.models import Named


class NamedType(ObjectType):
    """
    Type for models that extend the Named model.
    Should not be queried directly, but should be extended by other types.
    """

    name = String(required=True)
    description = String(required=False)

    @staticmethod
    def fields() -> list[str]:
        return [
            "name",
            "description",
        ]

    @staticmethod
    def resolve_name(parent: Named, info: ResolveInfo) -> str:
        return parent.name

    @staticmethod
    def resolve_description(parent: Named, info: ResolveInfo) -> str:
        return parent.description
