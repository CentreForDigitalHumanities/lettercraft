import json
from graphene_django.utils.testing import GraphQLTestCase

from event.models import Episode
from source.models import Source
from user.models import User


class ContributorTestCase(GraphQLTestCase):
    GRAPHQL_URL = "/api/graphql"

    # Any mutation involving a model that inherits EntityDescription will do.
    # For these tests, we'll use the Episode model.

    UPDATE_EPISODE_MUTATION = """
        mutation UPDATE_EPISODE($input: UpdateEpisodeMutationInput!) {
            updateEpisode(input: $input) {
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

    def test_single_contributor_one_contribution(self):
        self.client.force_login(self.user_1)

        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Palpatine"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Palpatine")

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

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Palpatine")
        self.assertEqual(len(episode.contributors.all()), 1)

        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Darth Vader"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Darth Vader")
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

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Han")
        self.assertEqual(len(episode.contributors.all()), 1)

        self.client.force_login(self.user_2)

        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Leia"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Leia")
        self.assertEqual(len(episode.contributors.all()), 2)

        first_contributor = episode.contributors.first()
        second_contributor = episode.contributors.last()

        if not first_contributor or not second_contributor:
            self.fail("No contributors found after mutation.")

        self.assertEqual(first_contributor.username, "Yoda")
        self.assertEqual(second_contributor.username, "Obi-Wan")

    def test_multiple_contributors_multiple_contributions(self):
        self.client.force_login(self.user_1)

        # First contribution by user 1
        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Jabba"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Jabba")
        self.assertEqual(len(episode.contributors.all()), 1)

        self.client.force_login(self.user_2)

        # First contribution by user 2
        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Jango"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Jango")
        self.assertEqual(len(episode.contributors.all()), 2)

        self.client.force_login(self.user_1)

        # Second contribution by user 1
        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Luke"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Luke")
        self.assertEqual(len(episode.contributors.all()), 2)

        self.client.force_login(self.user_2)

        # Second contribution by user 2
        response = self.query(
            query=self.UPDATE_EPISODE_MUTATION,
            input_data={"id": self.episode.pk, "name": "Jar-Jar"},
        )

        self.assertResponseNoErrors(response)

        content = json.loads(response.content)

        self.assertTrue(content["data"]["updateEpisode"]["ok"])
        self.assertEqual(len(content["data"]["updateEpisode"]["errors"]), 0)

        episode = Episode.objects.get(id=self.episode.pk)

        self.assertEqual(episode.name, "Jar-Jar")
        self.assertEqual(len(episode.contributors.all()), 2)

        first_contributor = episode.contributors.first()
        second_contributor = episode.contributors.last()

        if not first_contributor or not second_contributor:
            self.fail("No contributors found after mutation.")

        self.assertEqual(first_contributor.username, "Yoda")
        self.assertEqual(second_contributor.username, "Obi-Wan")
