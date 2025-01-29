from django.contrib.auth.models import AnonymousUser
from user.models import User
from typing import Union
from graphene import ResolveInfo


def has_mutation_permission(user: Union[AnonymousUser, User]) -> bool:
    return user.is_superuser or getattr(user, "is_contributor_alt", False)


def is_mutation(info: ResolveInfo) -> bool:
    return info.parent_type.name == "Mutation"


class GraphQLAuthMiddleware:

    def resolve(self, next, root, info: ResolveInfo, **kwargs):
        if is_mutation(info) and not has_mutation_permission(info.context.user):
            raise Exception("User is not authorised to make mutations")

        return next(root, info, **kwargs)
