from graphene_django import DjangoObjectType


class AbstractDjangoObjectType(DjangoObjectType):
    """
    Extends DjangoObjectType to include a fields method that returns all fields mentioned in the Meta class.
    """

    class Meta:
        abstract = True

    @classmethod
    def fields(cls) -> list[str]:
        """
        Returns all fields mentioned in the Meta class of the inheriting class.
        """
        return list(cls._meta.fields.keys())
