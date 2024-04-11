import pytest
from case_study.models import CaseStudy
from letter.models import LetterDescription

from person.models import HistoricalPerson, AgentDescription
from source.models import Source


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


# @pytest.fixture()
# def letter_action_writing(db, letter_description):
#     letter_action = LetterAction.objects.create()
#     # letter_action.letters.add(letter_description)
#     # letter_action.actors.add(agent)

#     LetterActionCategory.objects.create(
#         letter_action=letter_action,
#         value="write",
#     )

#     LetterEventDate.objects.create(
#         year_lower=500, year_upper=500, year_exact=500, letter_action=letter_action
#     )

#     return letter_action


# @pytest.fixture()
# def letter_action_reading(db, letter_description):
#     letter_action = LetterAction.objects.create()
#     # letter_action.letters.add(letter_description)
#     # letter_action.actors.add(agent_2)

#     LetterActionCategory.objects.create(
#         letter_action=letter_action,
#         value="read",
#     )

#     LetterEventDate.objects.create(
#         year_lower=505, year_upper=510, letter_action=letter_action
#     )

#     return letter_action


@pytest.fixture()
def case_study(db):
    case_study = CaseStudy.objects.create(name="Test Case Study")
    return case_study


# @pytest.fixture()
# def epistolary_event(db, letter_description, case_study):
#     epistolary_event = EpistolaryEvent.objects.create(
#         name="Test Epistolary event", note="Test note"
#     )
#     epistolary_event.case_studies.add(case_study)

#     return epistolary_event


# @pytest.fixture()
# def world_event(db):
#     world_event = WorldEvent.objects.create(
#         name="Test World Event", note="Test World Event note", year_exact=612
#     )
#     return world_event
