import pytest
from case_study.models import CaseStudy
from letter.models import Letter
from event.models import (
    EpistolaryEvent,
    LetterAction,
    LetterActionCategory,
    LetterEventDate,
)
from person.models import Person


@pytest.fixture()
def letter(db):
    letter = Letter.objects.create()
    letter.name = "letter for testing"
    letter.save()
    return letter


@pytest.fixture()
def person(db):
    person = Person.objects.create()
    person.name = "Bert"
    person.save()
    return person


@pytest.fixture()
def person_2(db):
    person = Person.objects.create()
    person.name = "Ernie"
    person.save()
    return person


@pytest.fixture()
def letter_action_writing(db, letter, person):
    letter_action = LetterAction.objects.create()
    letter_action.letters.add(letter)
    letter_action.actors.add(person)

    LetterActionCategory.objects.create(
        letter_action=letter_action,
        value="write",
    )

    LetterEventDate.objects.create(
        year_lower=500, year_upper=500, year_exact=500, letter_action=letter_action
    )

    return letter_action


@pytest.fixture()
def letter_action_reading(db, letter, person_2):
    letter_action = LetterAction.objects.create()
    letter_action.letters.add(letter)
    letter_action.actors.add(person_2)

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
        name="Test Epistolary event", note="Test note", case_studies=[case_study]
    )

    return epistolary_event
