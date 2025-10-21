from graphene import Field, List, ResolveInfo
from django.db.models import QuerySet
from graphene import ID, Field, List, NonNull, ObjectType, ResolveInfo
from django.db.models import QuerySet
from typing import Optional

from user.types.UserType import UserType
from user.types.ContributorRoleType import ContributorRoleType
from user.models import User, ContributorRole


class UserQueries(ObjectType):
    user_description = Field(UserType, id=ID(required=True))
    user_descriptions = List(NonNull(UserType), required=True)
    contributor_roles = List(NonNull(ContributorRoleType), required=True)

    @staticmethod
    def resolve_user_description(
        parent: None, info: ResolveInfo, id: str
    ) -> Optional[User]:
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

    @staticmethod
    def resolve_contributor_roles(
        parent: None,
        info: ResolveInfo,
    ) -> QuerySet[User]:
        return ContributorRoleType.get_queryset(ContributorRole.objects.all(), info)

