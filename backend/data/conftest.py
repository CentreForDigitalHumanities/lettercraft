import pytest

from . import models


@pytest.fixture()
def letter(db):
    letter = models.Letter.objects.create()
    return letter


@pytest.fixture()
def epistolary_event(db, letter):
    event = models.EpistolaryEvent.objects.create()

    models.EpistolaryEventCategory.objects.create(
        value='write',
        event=event
    )

    event.letters.add(letter)

    return event
