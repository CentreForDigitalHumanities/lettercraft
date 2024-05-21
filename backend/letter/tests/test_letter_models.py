def test_letter_description_model(letter_description):
    assert letter_description.senders.count() == 1
