from event.models import (
    EpistolaryEvent,
    WorldEvent,
)


def test_letter_action_name(letter, letter_action):
    action_str = str(letter_action)
    assert (
        str(action_str) == f"unknown action involving letter for testing (unknown date)"
    )


def test_letter_action_description_name(letter_description, letter_action_description):
    action_str = str(letter_action_description)
    assert (
        str(action_str)
        == f"unknown action involving description of letter for testing (unknown date) (described in De Fabeltjeskrant)"
    )


def test_letter_action_name_with_action(letter, letter_action_writing):
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


def test_world_event_triggers_epistolary_event(world_event, epistolary_event):
    world_event.triggered_epistolary_events.add(epistolary_event)
    world_event.save()
    trigger = world_event.triggered_epistolary_events.through.objects.first()

    assert str(trigger) == "Test World Event (612) triggered Test Epistolary event"


def test_world_event_triggers_world_event(world_event):
    world_event_2 = WorldEvent.objects.create(name="Test World Event 2", year_exact=700)
    world_event_2.save()
    world_event.triggered_world_events.add(world_event_2)
    trigger = world_event.triggered_world_events.through.objects.first()

    assert str(trigger) == "Test World Event (612) triggered Test World Event 2 (700)"


def test_epistolary_event_triggers_epistolary_event(epistolary_event):
    epistolary_event_2 = EpistolaryEvent.objects.create(name="Test Epistolary event 2")
    epistolary_event_2.save()
    epistolary_event.triggered_epistolary_events.add(epistolary_event_2)
    trigger = epistolary_event.triggered_epistolary_events.through.objects.first()

    assert str(trigger) == "Test Epistolary event triggered Test Epistolary event 2"
