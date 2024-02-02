def test_person_names(person_unnamed, person_single_name, person_multiple_names):

    assert person_unnamed.__str__().startswith("Unknown person #")
    assert person_single_name.__str__() == "Bert"
    assert person_multiple_names.__str__() == "Bert (aka Ernie, Oscar)"
