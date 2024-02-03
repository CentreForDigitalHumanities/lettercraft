def test_person_names(person_unnamed, person_single_name, person_multiple_names):

    assert person_unnamed.__str__().startswith("Unknown person #")
    assert person_single_name.__str__() == "Bert"
    assert person_multiple_names.__str__() == "Bert (aka Ernie, Oscar)"


def test_person_date_of_birth(person_with_exact_dob, person_with_approx_dob):
    assert person_with_exact_dob.date_of_birth.__str__().endswith("born in 512")
    assert person_with_approx_dob.date_of_birth.__str__().endswith("born c. 500–525")
