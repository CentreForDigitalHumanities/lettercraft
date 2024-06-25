from graphene_django.utils.testing import GraphQLTestCase

from source.models import Source
from user.models import User


class GraphQLAuthMiddleWareTestCase(GraphQLTestCase):
    """
    Tests for the GraphQLAuthMiddleware
    """

    GRAPHQL_URL = "/api/graphql"

    SOURCES_QUERY = """
        query GET_SOURCES {
            sources {
                id
            }
        }
    """

    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = User.objects.create(
            username="test", email="test@test.nl", password="test"
        )

        cls.source = Source.objects.create(
            name="Test Source",
            medieval_title="Test Medieval Title",
            medieval_author="Test Medieval Author",
            edition_title="Test Edition Title",
            edition_author="Test Edition Author",
        )

        return super().setUpTestData()

    def test_middleware_raises_exception_when_user_is_not_authenticated(self):
        response = self.query(self.SOURCES_QUERY)

        self.assertResponseHasErrors(response)

        content = response.json()

        self.assertEqual(content["errors"][0]["message"], "User is not authenticated")

    def test_middleware_does_not_raise_exception_when_user_is_authenticated(self):
        self.client.force_login(self.user)

        response = self.query(self.SOURCES_QUERY)

        self.assertResponseNoErrors(response)

        content = response.json()

        # The first Source in the list is the default MISSING_SOURCE.
        self.assertEqual(len(content["data"]["sources"]), 2)
        self.assertEqual(content["data"]["sources"][1]["id"], str(self.source.pk))
