from event.models import LetterEventDate


def test_letter_action_name(letter, letter_action_writing):
    letter_action_writing.date.year_exact = 500
    letter_action_writing.save()
    action_str = str(letter_action_writing)

    assert str(action_str) == f"writing of {str(letter)} (500)"


def test_letter_event_date_with_exact_date(letter_action_reading):
    letter_action_reading.date.year_exact = 500
    letter_action_reading.save()
    assert (
        str(letter_action_reading)
        == f"reading of {str(letter_action_reading.letters.first())} (500)"
    )


def test_letter_event_date_with_date_range(letter_action_reading):
    letter_action_reading.date.year_lower = 500
    letter_action_reading.date.year_upper = 600
    letter_action_reading.save()

    assert (
        str(letter_action_reading)
        == f"reading of {str(letter_action_reading.letters.first())} (c. 500–600)"
    )


def test_world_event(world_event):
    world_event.year_exact = 500
    world_event.save()
    assert str(world_event) == "Test World Event (500)"


def test_world_event_trigger(world_event, epistolary_event):
    world_event.epistolary_events.add(epistolary_event)
    world_event.save()

    trigger = world_event.epistolary_events.through.objects.first()

    assert str(trigger) == "Test World Event (612) triggered Test Epistolary event"
