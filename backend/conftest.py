import pytest
from source.models import Source
from case_study.models import CaseStudy
from letter.models import Letter, LetterDescription
from event.models import (
    EpistolaryEvent,
    LetterAction,
    LetterActionCategory,
    LetterActionDescription,
    WorldEvent,
    LetterEventDate,
)
from person.models import Agent, AgentDescription


@pytest.fixture()
def letter(db):
    letter = Letter.objects.create()
    letter.name = "letter for testing"
    letter.save()
    return letter


@pytest.fixture()
def letter_description(db, source):
    letter_description = LetterDescription.objects.create(
        source=source, location="Hoofdstuk 3"
    )
    letter_description.name = "description of letter for testing"
    letter_description.save()
    return letter_description


@pytest.fixture()
def agent(db):
    agent = Agent.objects.create()
    agent.name = "Bert"
    agent.save()
    return agent


@pytest.fixture()
def agent_description(db, source):
    agent_description = AgentDescription.objects.create(source=source)
    agent_description.name = "Bertus"
    agent_description.save()
    return agent_description


@pytest.fixture()
def agent_2(db):
    agent = Agent.objects.create()
    agent.name = "Ernie"
    agent.save()
    return agent


@pytest.fixture()
def agent_group(db):
    agent_group = Agent.objects.create()
    agent_group.name = "The Muppets"
    agent_group.is_group = True
    agent_group.save()
    return agent_group


@pytest.fixture()
def letter_action(db, letter, agent):
    letter_action = LetterAction.objects.create()
    letter_action.letters.add(letter)
    letter_action.actors.add(agent)
    return letter_action


@pytest.fixture()
def letter_action_description(db, letter_description, agent_description, source):
    letter_action_description = LetterActionDescription.objects.create(
        source=source, location="Hoofdstuk 2"
    )
    letter_action_description.letters.add(letter_description)
    letter_action_description.actors.add(agent_description)

    return letter_action_description


@pytest.fixture()
def letter_action_writing(db, letter, agent):
    letter_action = LetterAction.objects.create()
    letter_action.letters.add(letter)
    letter_action.actors.add(agent)

    LetterActionCategory.objects.create(
        letter_action=letter_action,
        value="write",
    )

    LetterEventDate.objects.create(
        year_lower=500, year_upper=500, year_exact=500, letter_action=letter_action
    )

    return letter_action


@pytest.fixture()
def letter_action_reading(db, letter, agent_2):
    letter_action = LetterAction.objects.create()
    letter_action.letters.add(letter)
    letter_action.actors.add(agent_2)

    LetterActionCategory.objects.create(
        letter_action=letter_action,
        value="read",
    )

    LetterEventDate.objects.create(
        year_lower=505, year_upper=510, letter_action=letter_action
    )

    return letter_action


@pytest.fixture()
def case_study(db):
    case_study = CaseStudy.objects.create(name="Test Case Study")
    return case_study


@pytest.fixture()
def epistolary_event(db, letter, case_study):
    epistolary_event = EpistolaryEvent.objects.create(
        name="Test Epistolary event", note="Test note"
    )
    epistolary_event.case_studies.add(case_study)

    return epistolary_event


@pytest.fixture()
def world_event(db):
    world_event = WorldEvent.objects.create(
        name="Test World Event", note="Test World Event note", year_exact=612
    )
    return world_event


@pytest.fixture()
def source(db):
    source = Source.objects.create(
        name="De Fabeltjeskrant", bibliographical_info="first edition"
    )
    return source
