def test_letter_action_name(letter, letter_action):
    action_str = str(letter_action)

    assert str(action_str) == f'writing of {str(letter)}'
