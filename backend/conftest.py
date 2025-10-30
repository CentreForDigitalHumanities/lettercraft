from allauth.account.models import EmailAddress
import pytest
from graphene.test import Client as GrapheneClient
from typing import Generator
from django.contrib.auth.models import AnonymousUser
from django.test import Client as APIClient, RequestFactory
from django.core.handlers.wsgi import WSGIRequest

from case_study.models import CaseStudy
from letter.models import LetterDescription

from person.models import HistoricalPerson, AgentDescription
from source.models import Source
from event.models import Episode
from user.models import User, ContributorGroup, ContributorRole
from space.models import SpaceDescription
from graphql_app.schema import schema

@pytest.fixture(autouse=True)
def tmp_media_root(settings, tmp_path):
    directory = tmp_path / 'data'
    directory.mkdir()
    settings.MEDIA_ROOT = directory
    return directory


@pytest.fixture()
def user_data():
    return {
        "username": "JohnDoe",
        "email": "j.doe@nowhere.org",
        "password": "secretpassword",
        "first_name": "John",
        "last_name": "Doe",
    }


@pytest.fixture()
def user(db, user_data):
    user = User.objects.create(
        username=user_data["username"],
        email=user_data["email"],
        password=user_data["password"],
        first_name=user_data["first_name"],
        last_name=user_data["last_name"],
    )
    EmailAddress.objects.create(
        user=user, email=user.email, verified=True, primary=True
    )
    return user


@pytest.fixture
def user_client(client, user) -> Generator[APIClient, None, None]:
    client.force_login(user)
    yield client
    client.logout()

@pytest.fixture
def contributor_role(db, user) -> ContributorRole:
    return ContributorRole.objects.create(
        name='tester'
    )

@pytest.fixture
def user_has_contributor_role(db, user, contributor_role) -> ContributorRole:
    user.profile.role = contributor_role
    user.profile.save()

@pytest.fixture()
def source(db):
    return Source.objects.create(name="Sesame Street", is_public=True)


@pytest.fixture()
def contributor_group(db, source, user):
    group = ContributorGroup.objects.create(name="contributors")
    group.users.add(user)
    group.sources.add(source)
    return group


@pytest.fixture()
def letter_description(db, source):
    letter = LetterDescription.objects.create(
        name="Bert's letter",
        source=source,
    )
    return letter


@pytest.fixture()
def historical_person(db):
    person = HistoricalPerson.objects.create(name="Bert")
    return person


@pytest.fixture()
def historical_person_2(db):
    person = HistoricalPerson.objects.create(name="Ernie")
    return person


@pytest.fixture()
def agent_description(db, historical_person, source):
    agent = AgentDescription.objects.create(
        name="Bert",
        source=source,
    )
    agent.describes.add(historical_person)
    agent.save()
    return agent


@pytest.fixture()
def agent_description_2(db, historical_person_2, source):
    agent = AgentDescription.objects.create(
        name="Ernie",
        source=source,
    )
    agent.describes.add(historical_person_2)
    agent.save()
    return agent


@pytest.fixture()
def agent_group_description(db, source, historical_person, historical_person_2):
    agent = AgentDescription.objects.create(
        name="The Muppets",
        source=source,
        is_group=True,
    )
    agent.describes.add(historical_person)
    agent.describes.add(historical_person_2)
    agent.save()
    return agent


@pytest.fixture()
def space_description(db, source):
    space = SpaceDescription.objects.create(name="Sesame street", source=source)
    return space


@pytest.fixture()
def episode(db, source, agent_description, agent_description_2, letter_description):
    episode = Episode.objects.create(
        name="Bert writes a letter",
        source=source,
    )
    episode.agents.add(agent_description)
    episode.agents.add(agent_description_2)
    episode.letters.add(letter_description)
    return episode


@pytest.fixture()
def episode_2(db, source, agent_description, agent_description_2, letter_description):
    episode = Episode.objects.create(
        name="Ernie eats a letter",
        source=source,
    )
    episode.agents.add(agent_description)
    episode.agents.add(agent_description_2)
    episode.letters.add(letter_description)
    return episode


@pytest.fixture()
def case_study(db):
    case_study = CaseStudy.objects.create(name="Test Case Study")
    return case_study


@pytest.fixture()
def graphql_client() -> GrapheneClient:
    client = GrapheneClient(schema)
    return client


@pytest.fixture()
def user_request(user) -> WSGIRequest:
    """Reproduces a request by the user to the graphql API. Can be used as context for
    the graphql_client."""
    factory = RequestFactory()
    request = factory.post("/api/graphql")
    request.user = user
    return request


@pytest.fixture()
def anonymous_request() -> WSGIRequest:
    """Reproduces an anonymous request to the graphql API. Can be used as context for
    the graphql_client."""
    factory = RequestFactory()
    request = factory.post("/api/graphql")
    request.user = AnonymousUser()
    return request
