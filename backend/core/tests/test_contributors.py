from graphene_django.utils.testing import GraphQLTestCase

from event.models import Episode
from source.models import Source
from user.models import User, ContributorGroup


class ContributorTestCase(GraphQLTestCase):
    GRAPHQL_URL = "/api/graphql"

    # Any mutation involving a model that inherits EntityDescription will do.
    # For these tests, we'll use the Episode model.

    UPDATE_EPISODE_MUTATION = """
        mutation UPDATE_EPISODE($input: UpdateEpisodeInput!) {
            updateEpisode(episodeData: $input) {
                ok
                errors {
                    field
                    messages
                }
            }
        }
    """

    @classmethod
    def setUpTestData(cls) -> None:
        source = Source.objects.create(name="A New Hope")
        cls.episode = Episode.objects.create(
            name="Death Star destroyed", source_id=source.pk
        )
        cls.user_1 = User.objects.create(username="Yoda")
        cls.user_2 = User.objects.create(username="Obi-Wan")
        group = ContributorGroup.objects.create(name="Jedi")
        group.users.add(cls.user_1)
        group.users.add(cls.user_2)
        group.sources.add(source)

    def test_single_contributor_one_contribution(self):
        self.client.force_login(self.user_1)

        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Palpatine"},
        )
        self.assertResponseNoErrors(response)

        episode = Episode.objects.get(id=self.episode.pk)

        first_contributor = episode.contributors.first()

        if not first_contributor:
            self.fail("No contributors found after mutation.")

        self.assertEqual(first_contributor.username, "Yoda")

    def test_one_contributor_multiple_contributions(self):
        self.client.force_login(self.user_1)

        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Palpatine"},
        )
        self.assertResponseNoErrors(response)

        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Darth Vader"},
        )
        self.assertResponseNoErrors(response)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(
            len(episode.contributors.all()),
            1,
            "Contributors should not increase after multiple contributions.",
        )

    def test_multiple_contributors_one_contribution(self):
        self.client.force_login(self.user_1)
        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Han"},
        )
        self.assertResponseNoErrors(response)

        self.client.force_login(self.user_2)
        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Leia"},
        )
        self.assertResponseNoErrors(response)

        episode = Episode.objects.get(id=self.episode.pk)

        first_contributor = episode.contributors.first()
        second_contributor = episode.contributors.last()

        if not first_contributor or not second_contributor:
            self.fail("No contributors found after mutation.")

        self.assertEqual(first_contributor.username, "Yoda")
        self.assertEqual(second_contributor.username, "Obi-Wan")

    def test_multiple_contributors_multiple_contributions(self):
        self.client.force_login(self.user_1)
        response_1_1 = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Jabba"},
        )
        response_1_2 = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Anakin"},
        )

        self.client.force_login(self.user_2)
        response_2_1 = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Jango"},
        )
        response_2_2 = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Boba"},
        )

        self.assertResponseNoErrors(response_1_1)
        self.assertResponseNoErrors(response_1_2)
        self.assertResponseNoErrors(response_2_1)
        self.assertResponseNoErrors(response_2_2)

        episode = Episode.objects.get(id=self.episode.pk)

        first_contributor = episode.contributors.first()
        second_contributor = episode.contributors.last()

        if not first_contributor or not second_contributor:
            self.fail("No contributors found after mutation.")

        self.assertEqual(first_contributor.username, "Yoda")
        self.assertEqual(second_contributor.username, "Obi-Wan")


def test_contributor_visibility(
    graphql_client, user, contributor_role, agent_description, anonymous_request
):
    agent_description.contributors.add(user)

    query = f"""
    query Test {{
        agentDescription(id: "{agent_description.id}") {{ contributors {{ id }} }}
    }}
    """

    result = graphql_client.execute(query, context=anonymous_request)
    assert len(result["data"]["agentDescription"]["contributors"]) == 0

    user.profile.role = contributor_role
    user.profile.save()

    result = graphql_client.execute(query, context=anonymous_request)
    assert len(result["data"]["agentDescription"]["contributors"]) == 1

