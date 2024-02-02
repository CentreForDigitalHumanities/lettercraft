import pytest
from case_study.models import CaseStudy
from letter.models import Letter
from event.models import EpistolaryEvent, LetterAction, LetterActionCategory
from person.models import Person, PersonDateOfBirth, PersonName


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
        name="Test Epistolary event", note="Test note", case_studies=[case_study]
    )

    return epistolary_event


@pytest.fixture()
def person_unnamed(db):
    person = Person.objects.create()
    return person


@pytest.fixture()
def person_single_name(db):
    person = Person.objects.create()
    PersonName.objects.create(person=person, value="Bert")
    return person


@pytest.fixture()
def person_multiple_names(db):
    person = Person.objects.create()
    PersonName.objects.create(person=person, value="Bert")
    PersonName.objects.create(person=person, value="Ernie")
    PersonName.objects.create(person=person, value="Oscar")
    return person

@pytest.fixture()
def person_with_exact_dob(db):
    person = Person.objects.create()
    PersonDateOfBirth.objects.create(person=person, year_exact=512)
    return person

@pytest.fixture()
def person_with_approx_dob(db):
    person = Person.objects.create()
    PersonDateOfBirth.objects.create(person=person, year_lower=500, year_upper=525)
    return person