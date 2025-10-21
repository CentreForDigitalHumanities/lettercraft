from graphene import ResolveInfo, List, NonNull
from graphene_django import DjangoObjectType

from django.db.models import QuerySet
from user.models import User, ContributorRole


class ContributorRoleType(DjangoObjectType):
    users = List(NonNull('user.types.UserType.UserType'), required=True)

    class Meta:
        model = ContributorRole
        fields = [
            "id",
            "name",
            "description",
        ]

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[ContributorRole], info: ResolveInfo
    ) -> QuerySet[ContributorRole]:
        return queryset.filter(user_profiles__isnull=False)

    @staticmethod
    def resolve_users(
        parent: ContributorRole, info: ResolveInfo
    ) -> QuerySet[User]:
        return User.objects.filter(profile__role=parent)
