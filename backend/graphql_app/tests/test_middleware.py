from rest_framework.status import is_success
import json

QUERY_EXAMPLE = """
    query TestQuery {
        sources {
            id
        }
    }
"""

MUTATION_EXAMPLE = """
    mutation TestMutation {
        createAgent(agentData: {name: "test", source: "1"}) {
            ok
        }
    }
"""


def test_middleware_passes_queries(client, db):
    response = client.post(
        "/api/graphql",
        {
            "operationName": "TestQuery",
            "query": QUERY_EXAMPLE,
        },
    )

    assert is_success(response.status_code)
    data = json.loads(response.content)
    assert not "errors" in data


def test_middleware_blocks_mutation_from_unauthorised_user(user_client, source):
    response = user_client.post(
        "/api/graphql",
        {
            "operationName": "TestMutation",
            "query": MUTATION_EXAMPLE,
        },
    )

    assert is_success(response.status_code)
    data = json.loads(response.content)
    assert data["errors"][0]["message"] == "User is not authorised to make mutations"


def test_middleware_passes_mutation_from_authorised_user(user, user_client, source):
    user.is_contributor = True
    user.save()

    response = user_client.post(
        "/api/graphql",
        {
            "operationName": "TestMutation",
            "query": MUTATION_EXAMPLE,
        },
    )

    assert is_success(response.status_code)
    data = json.loads(response.content)
    assert not "errors" in data
