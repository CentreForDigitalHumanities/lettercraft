from graphene import ResolveInfo, String
from graphene_django import DjangoObjectType

from django.db.models import QuerySet
from user.models import User


class UserType(DjangoObjectType):
    full_name = String(required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
        ]

    @classmethod
    def get_queryset(
        cls, queryset: QuerySet[User], info: ResolveInfo
    ) -> QuerySet[User]:
        return queryset.filter(profile__role__isnull=False)
