from graphene import ResolveInfo
from graphene_django import DjangoObjectType

from django.db.models import QuerySet
from user.models import User


class UserType(DjangoObjectType):
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
        return queryset.all()
