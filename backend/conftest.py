import pytest
from case_study.models import CaseStudy
from letter.models import Letter
from event.models import EpistolaryEvent, LetterAction, LetterActionCategory, WorldEvent
from person.models import Person


@pytest.fixture()
def letter(db):
    letter = Letter.objects.create()
    return letter


@pytest.fixture()
def person(db):
    person = Person.objects.create()
    return person


@pytest.fixture()
def letter_action(db, letter, person):
    letter_action = LetterAction.objects.create()
    letter_action.letters.add(letter)
    letter_action.actors.add(person)

    LetterActionCategory.objects.create(
        letter_action=letter_action,
        value="write",
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
