from django.conf import settings
from django.urls import path
from graphene_django.views import GraphQLView
from django.views.decorators.csrf import csrf_exempt

# TODO: Handle CSRF correctly.
urlpatterns = [
    path(
        "graphql", csrf_exempt(GraphQLView.as_view(graphiql=settings.ENABLE_GRAPHIQL))
    ),
]
