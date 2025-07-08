import pytest
from django.core.handlers.wsgi import WSGIRequest
from graphene.test import Client as GrapheneClient
from django.test import Client
from rest_framework import status

from source.models import Source, SourceImage
from user.models import ContributorGroup, User


RESOLVE_SOURCE_QUERY = """
    query ResolveSource($id: ID!, $editable: Boolean = false) {
        source(id: $id, editable: $editable) {
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


def test_sources_query(
    graphql_client, user, source, user_request, anonymous_request, contributor_group
):

    other_source = Source.objects.create(name="Pat & Mat")

    result_all = graphql_client.execute(
        "query AllSources { sources { id } }", context=user_request
    )
    ids_from_result = lambda result: [
        int(item["id"]) for item in result["data"]["sources"]
    ]
    assert source.id in ids_from_result(result_all)
    assert other_source.pk in ids_from_result(result_all)

    result_editable = graphql_client.execute(
        "query MySources { sources(editable: true) { id } }",
        context=user_request,
    )
    assert source.id in ids_from_result(result_editable)
    assert other_source.pk not in ids_from_result(result_editable)

    result_editable_empty = graphql_client.execute(
        "query MySources { sources(editable: true) { id } }",
        context=anonymous_request,
    )
    assert source.id not in ids_from_result(result_editable_empty)
    assert other_source.pk not in ids_from_result(result_editable_empty)


@pytest.mark.django_db
def test_resolve_non_existent_source(
    graphql_client: GrapheneClient, user_request: WSGIRequest
) -> None:
    """Test querying for a source that does not exist."""
    non_existent_id = "999999999999"
    variables = {"id": non_existent_id}

    result = execute_as_user(
        graphql_client,
        variables,
        user_request,
    )
    assert result["data"]["source"] is None


@pytest.mark.django_db
def test_resolve_public_source_browsing_anonymous(
    graphql_client: GrapheneClient, anonymous_request: WSGIRequest, source: Source
) -> None:
    """Test access to a public source in browsing interface for anonymous users / visitors."""
    source.is_public = True
    source.save()

    variables = {"id": str(source.pk)}
    result = execute_as_user(graphql_client, variables, anonymous_request)
    assert result["data"]["source"] is not None
    assert result["data"]["source"]["id"] == str(source.pk)


@pytest.mark.django_db
def test_resolve_non_public_source_non_contributors(
    graphql_client: GrapheneClient, user_request: WSGIRequest, source: Source
) -> None:
    """Test public access to a non-public source in browsing interface for non-contributing users."""
    source.is_public = False
    source.save()

    variables = {"id": str(source.pk)}
    result = execute_as_user(graphql_client, variables, user_request)
    assert result["data"]["source"] is None


@pytest.mark.django_db
def test_resolve_non_public_source_superusers(
    graphql_client: GrapheneClient,
    source: Source,
    user_request: WSGIRequest,
    user: User,
):
    """Test authenticated access to a non-public source in browsing interface for superusers."""
    source.is_public = False
    source.save()

    user.is_superuser = True
    user.save()

    variables_is_public_false = {"id": str(source.pk)}
    result = execute_as_user(
        graphql_client,
        variables_is_public_false,
        user_request,
    )
    assert result["data"]["source"] is not None
    assert result["data"]["source"]["id"] == str(source.pk)


@pytest.mark.django_db
def test_resolve_non_public_source_contributor(
    graphql_client: GrapheneClient,
    user_request: WSGIRequest,
    source: Source,
    user: User,
) -> None:
    """Test authenticated access to a non-public source in browsing interface for contributing users."""
    source.is_public = False
    source.save()

    group = ContributorGroup.objects.create(name="Test Source contributors")
    group.users.add(user)
    group.sources.add(source)

    variables = {"id": str(source.pk)}
    result = execute_as_user(
        graphql_client,
        variables,
        user_request,
    )
    assert (
        result["data"]["source"] is None
    ), "Contributors should not be able to access non-public sources in browsing interface."


@pytest.mark.django_db
def test_resolve_public_source_editing_non_contributor(
    graphql_client: GrapheneClient, user_request: WSGIRequest, source: Source
) -> None:
    """Test access to a public source in editing interface for non-contributors."""
    source.is_public = True
    source.save()

    variables = {"id": str(source.pk), "editable": True}
    result = execute_as_user(graphql_client, variables, user_request)

    assert (
        result["data"]["source"] is None
    ), "Public sources should not be accessible to non-contributing users in editing interface."


@pytest.mark.django_db
def test_resolve_public_source_editing_contributor(
    graphql_client: GrapheneClient,
    user_request: WSGIRequest,
    source: Source,
    user: User,
) -> None:
    """Test access to a public source in editing interface for contributors."""
    source.is_public = True
    source.save()

    group = ContributorGroup.objects.create(name="Test Source contributors")
    group.users.add(user)
    group.sources.add(source)

    variables = {"id": str(source.pk), "editable": True}
    result = execute_as_user(graphql_client, variables, user_request)

    assert result["data"]["source"]["id"] == str(
        source.pk
    ), "Public sources should be accessible to contributors in editing interface."


@pytest.mark.django_db
def test_resolve_public_source_editing_anonymous(
    graphql_client: GrapheneClient, anonymous_request: WSGIRequest, source: Source
) -> None:
    """Test access to a public source in editing interface for anonymous users."""
    source.is_public = True
    source.save()

    variables = {"id": str(source.pk), "editable": True}
    result = execute_as_user(graphql_client, variables, anonymous_request)

    assert (
        result["data"]["source"] is None
    ), "Public sources should not be accessible in editing interface without contributor access"


def test_resolve_source_image(
        client: Client,
        graphql_client: GrapheneClient, anonymous_request: WSGIRequest,
        source: Source, source_image: SourceImage,
):
    query = """
        query Source($id: ID!) {
            source(id: $id) {
                id
                image {
                    url
                    altText
                    caption
                }
            }
        }
    """
    variables = {"id": str(source.pk)}
    result = graphql_client.execute(
        query, variables=variables, context=anonymous_request,
    )
    assert result['data']['source']['image']['altText'] == source_image.alt_text

    image_url = result['data']['source']['image']['url']
    response = client.get(image_url)
    assert response.status_code == status.HTTP_200_OK

