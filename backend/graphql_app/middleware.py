class GraphQLAuthMiddleware:
    def resolve(self, next, root, info, **kwargs):
        if info.context.user.is_authenticated:
            return next(root, info, **kwargs)
        raise Exception("User is not authenticated")
