import json
from django.conf import settings


class GraphQLAuthMiddleware:
    def resolve(self, next, root, info, **kwargs):
        request = info.context

        # Allow introspection queries to pass through in development mode.
        if settings.DEBUG and self.is_introspection_query(request):
            return next(root, info, **kwargs)

        if info.context.user.is_authenticated:
            return next(root, info, **kwargs)

        raise Exception("User is not authenticated")

    def is_introspection_query(self, request):
        data = json.loads(request.body)
        query = data.get("query")  # type: str
        return query.startswith("query IntrospectionQuery")
