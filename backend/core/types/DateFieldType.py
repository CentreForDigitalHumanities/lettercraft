from graphene import ObjectType, ResolveInfo, String

from core.models import LettercraftDate


class LettercraftDateType(ObjectType):
    """
    Type for models that extend the LettercraftDate model.
    Should not be queried directly, but should be extended by other types.
    """

    display_date = String(required=True)

    @staticmethod
    def fields() -> list[str]:
        return [
            "year_lower",
            "year_upper",
            "year_exact",
            "display_date",
        ]

    @staticmethod
    def resolve_display_date(parent: LettercraftDate, info: ResolveInfo) -> str:
        return parent.display_date
