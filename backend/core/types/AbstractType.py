from graphene import ObjectType


class AbstractType(ObjectType):
    """
    Simple type that allows that returns all fields of a type that inherits it.
    """

    @classmethod
    def fields(cls) -> list[str]:
        """
        Returns all fields mentioned in the Meta class of the type inheriting AbstractType.
        """
        return list(cls._meta.fields.keys())
