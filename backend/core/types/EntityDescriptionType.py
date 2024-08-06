from core.models import EntityDescription
from core.types.AbstractDjangoObjectType import AbstractDjangoObjectType
from core.types.NamedType import NamedType
from graphene import List, ResolveInfo
from django.db.models import QuerySet

from user.models import User
from user.types.UserType import UserType

class EntityDescriptionType(NamedType, AbstractDjangoObjectType):
    """
    Type for models that extend the EntityDescription model.
    Should not be queried directly, but should be extended by other types.
    """

    contributors = List(UserType)

    class Meta:
        model = EntityDescription
        fields = [
            "source",
            "source_mention",
            "designators",
            "book",
            "chapter",
            "page",
            "contributors",
        ] + NamedType.fields()

    @staticmethod
    def resolve_contributors(
        parent: EntityDescription, info: ResolveInfo
    ) -> QuerySet[User]:
        return parent.contributors.all()
