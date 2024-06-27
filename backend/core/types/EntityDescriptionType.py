from core.models import EntityDescription
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType
from core.types.NamedType import NamedType


class EntityDescriptionType(NamedType, AbstractDjangoObjectType):
    """
    Type for models that extend the EntityDescription model.
    Should not be queried directly, but should be extended by other types.
    """

    class Meta:
        model = EntityDescription
        fields = [
            "source",
            "source_mention",
            "designators",
            "book",
            "chapter",
            "page",
        ] + NamedType.fields()
