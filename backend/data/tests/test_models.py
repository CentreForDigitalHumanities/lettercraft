

def test_event_name(letter, epistolary_event):
    letter_str = str(letter)

    assert str(epistolary_event) == f'writing of {letter_str}'
