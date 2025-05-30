import pytest
from django.core.handlers.wsgi import WSGIRequest
from graphene.test import Client as GrapheneClient

from source.models import Source
from user.models import ContributorGroup, User


RESOLVE_SOURCE_QUERY = """
    query ResolveSource($id: ID!, $isPublic: Boolean) {
        source(id: $id, isPublic: $isPublic) {
            id
        }
    }
"""


def execute_as_user(
    client: GrapheneClient, variables: dict, user_request: WSGIRequest
) -> dict:
    """
    Helper function to execute a GraphQL query as a specific user and do some
    basic error checking.
    """
    result = client.execute(
        RESOLVE_SOURCE_QUERY, variables=variables, context=user_request
    )
    assert result is not None, "GraphQL result should not be None"
    assert "errors" not in result, f"GraphQL errors: {result.get('errors')}"
    return result


def test_episode_entity_link_query(
    graphql_client, user_request, contributor_group, source, user, episode
):
    # Adding contributor group as a parameter adds the user to the contributor
    # group of the source as a side-effect.
    episode.contributors.add(user)

    result = graphql_client.execute(
        f"""
        query TestQuery {{
            source(
                id: "{source.id}",
            ) {{
                id
                contributors {{ id }}
            }}
        }}
        """,
        context=user_request,
    )
    assert result["data"]["source"]["contributors"]


@pytest.mark.django_db
def test_resolve_source_not_found(
    graphql_client: GrapheneClient, user_request: WSGIRequest
) -> None:
    """Test querying for a source that does not exist."""
    non_existent_id = "999999999999"
    variables = {"id": non_existent_id, "isPublic": False}

    result = execute_as_user(
        graphql_client,
        variables,
        user_request,
    )
    assert result["data"]["source"] is None


@pytest.mark.django_db
def test_resolve_source_public_access_is_public(
    graphql_client: GrapheneClient, user_request: WSGIRequest, source: Source
) -> None:
    """Test access to a public source."""
    source.is_public = True
    source.save()

    variables = {"id": str(source.pk), "isPublic": True}
    result = execute_as_user(graphql_client, variables, user_request)
    assert result["data"]["source"] is not None
    assert result["data"]["source"]["id"] == str(source.pk)


@pytest.mark.django_db
def test_resolve_source_public_access_is_not_public(
    graphql_client: GrapheneClient, user_request: WSGIRequest, source: Source
) -> None:
    """Test public access to a non-public source for non-contributors."""
    source.is_public = False
    source.save()

    variables = {"id": str(source.pk), "isPublic": True}
    result = execute_as_user(graphql_client, variables, user_request)
    assert "errors" not in result, f"GraphQL errors: {result.get('errors')}"
    assert result["data"]["source"] is None


@pytest.mark.django_db
def test_resolve_source_authenticated_can_edit_as_superuser(
    graphql_client: GrapheneClient,
    source: Source,
    user_request: WSGIRequest,
    user: User,
):
    """Test authenticated access to a non-public source for superusers."""
    source.is_public = False
    source.save()

    user.is_superuser = True
    user.save()

    variables_is_public_false = {"id": str(source.pk), "isPublic": False}
    result = execute_as_user(
        graphql_client,
        variables_is_public_false,
        user_request,
    )
    assert result["data"]["source"] is not None
    assert result["data"]["source"]["id"] == str(source.pk)


@pytest.mark.django_db
def test_resolve_source_authenticated_can_edit_by_group(
    graphql_client: GrapheneClient,
    user_request: WSGIRequest,
    source: Source,
    user: User,
) -> None:
    """Test authenticated access to a non-public source for editors."""
    source.is_public = False
    source.save()

    group = ContributorGroup.objects.create(name="Test Source Editors")
    group.users.add(user)
    group.sources.add(source)

    variables = {"id": str(source.pk), "isPublic": False}
    result = execute_as_user(
        graphql_client,
        variables,
        user_request,
    )
    assert result["data"]["source"] is not None
    assert result["data"]["source"]["id"] == str(source.pk)


@pytest.mark.django_db
def test_resolve_source_authenticated_cannot_edit(
    graphql_client: GrapheneClient,
    user_request: WSGIRequest,
    source: Source,
    user: User,
) -> None:
    """Test authenticated access to a non-public source where user CANNOT edit."""
    source.is_public = False
    source.save()

    # Remove user from any contributor groups that might have access.
    for group_instance in ContributorGroup.objects.filter(users=user, sources=source):
        group_instance.users.remove(user)

    variables = {"id": str(source.pk), "isPublic": False}
    result = execute_as_user(
        graphql_client,
        variables,
        user_request,
    )
    assert result["data"]["source"] is None
