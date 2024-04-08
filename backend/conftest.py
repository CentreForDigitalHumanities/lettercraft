import pytest
from source.models import Source
from case_study.models import CaseStudy, Episode
from letter.models import LetterDescription
from event.models import EventDescription
from person.models import Person, AgentDescription


@pytest.fixture()
def letter(db, source):
    letter = LetterDescription.objects.create(
        name="letter for testing",
        source=source,
        location="Hoofdstuk 3",
    )
    letter.save()
    return letter


@pytest.fixture()
def person(db):
    person = Person.objects.create()
    person.name = "Bert"
    person.save()
    return person


@pytest.fixture()
def agent_description(db, source):
    agent_description = AgentDescription.objects.create(source=source)
    agent_description.name = "Bertus"
    agent_description.save()
    return agent_description


@pytest.fixture()
def person_2(db):
    agent = Person.objects.create()
    agent.name = "Ernie"
    agent.save()
    return agent


@pytest.fixture()
def agent_group_description(db):
    agent_group = AgentDescription.objects.create()
    agent_group.name = "The Muppets"
    agent_group.is_group = True
    agent_group.save()
    return agent_group


@pytest.fixture()
def event_description(db, letter, agent, source):
    letter_action = EventDescription.objects.create(
        source=source, location="Hoofdstuk 2"
    )
    letter_action.letters.add(letter)
    letter_action.actors.add(agent)
    return letter_action


@pytest.fixture()
def case_study(db):
    case_study = CaseStudy.objects.create(name="Test Case Study")
    return case_study


@pytest.fixture()
def episode(db, event_description, case_study):
    episode = Episode.objects.create(name="Test episode", note="Test note")
    episode.case_studies.add(case_study)

    return episode


@pytest.fixture()
def source(db):
    source = Source.objects.create(
        name="De Fabeltjeskrant", bibliographical_info="first edition"
    )
    return source
