from event.models import LetterEventDate


def test_letter_action_name(letter, letter_action):
    action_str = str(letter_action)

    assert str(action_str) == f"writing of {str(letter)}"


def test_letter_event_date_with_exact_date(letter_action):
    letter_event_date = LetterEventDate.objects.create(
        letter_action=letter_action,
        year_exact=500,
    )
    assert (
        str(letter_event_date)
        == f"writing of {str(letter_action.letters.first())} (500)"
    )


def test_letter_event_date_with_date_range(letter_action):
    letter_event_date = LetterEventDate.objects.create(
        letter_action=letter_action,
        year_lower=500,
        year_upper=600,
    )
    assert (
        str(letter_event_date)
        == f"writing of {str(letter_action.letters.first())} (c. 500–600)"
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
    
