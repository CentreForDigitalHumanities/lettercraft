from graphene import Field, List, ResolveInfo
from django.db.models import QuerySet
from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet
from user.types.UserType import UserType
from user.models import User


class UserQueries(ObjectType):
    user_description = Field(UserType, id=ID(required=True))
    user_descriptions = List(NonNull(UserType), required=True)

    @staticmethod
    def resolve_user_description(
        parent: None, info: ResolveInfo, id: str
    ) -> User | None:
        try:
            return UserType.get_queryset(User.objects, info).get(id=id)
        except User.DoesNotExist:
            return None

    @staticmethod
    def resolve_user_descriptions(
        parent: None,
        info: ResolveInfo,
    ) -> QuerySet[User]:
        return UserType.get_queryset(User.objects, info)
