from allauth.account.models import EmailAddress
import pytest

from case_study.models import CaseStudy
from letter.models import LetterDescription

from person.models import HistoricalPerson, AgentDescription
from source.models import Source
from event.models import EventDescription
from user.models import User


@pytest.fixture()
def user_data():
    return {
        "username": "JohnDoe",
        "email": "j.doe@nowhere.org",
        "password": "secret",
        "first_name": "John",
        "last_name": "Doe",
    }


@pytest.fixture()
def user(db, user_data):
    user = User.objects.create(
        username=user_data["username"],
        email=user_data["email"],
        password=user_data["password"],
        first_name="John",
        last_name="Doe",
    )
    EmailAddress.objects.create(
        user=user, email=user.email, verified=True, primary=True
    )
    return user


@pytest.fixture
def user_client(client, user):
    client.force_login(user)
    yield client
    client.logout()


@pytest.fixture()
def source(db):
    return Source.objects.create(name="Sesame Street")


@pytest.fixture()
def letter_description(db, source, agent_description):
    letter = LetterDescription.objects.create(
        name="Bert's letter",
        source=source,
    )
    letter.senders.add(agent_description)
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
def agent_description_2(db, historical_person, source):
    agent = AgentDescription.objects.create(
        name="Ernie",
        source=source,
    )
    agent.describes.add(historical_person)
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
def event_description(db, source, agent_description, agent_description_2):
    event = EventDescription.objects.create(
        name="Bert writes a letter",
        source=source,
    )
    event.agents.add(agent_description)
    event.agents.add(agent_description_2)
    return event


@pytest.fixture()
def case_study(db):
    case_study = CaseStudy.objects.create(name="Test Case Study")
    return case_study
