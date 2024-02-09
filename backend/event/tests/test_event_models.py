def test_letter_action_name(letter, letter_action_writing):
    action_str = str(letter_action_writing)

    assert str(action_str) == f"writing of {str(letter)}"
