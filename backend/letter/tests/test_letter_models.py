def test_letter_property_inference(
    letter, letter_action_writing, letter_action_reading
):
    assert letter.date_written() == (500, 500)
    assert letter.date_active() == (500, 510)
