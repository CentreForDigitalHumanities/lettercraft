from person.models import PersonDateOfBirth, PersonName


def test_person_name_for_unnamed_person(person):
    assert person.__str__().startswith("Unknown person #")


def test_person_name_for_person_with_single_name(person):
    PersonName.objects.create(person=person, value="Bert")
    assert person.__str__() == "Bert"


def test_person_name_for_person_with_multiple_names(person):
    PersonName.objects.create(person=person, value="Bert")
    PersonName.objects.create(person=person, value="Ernie")
    PersonName.objects.create(person=person, value="Oscar")
    assert person.__str__() == "Bert (aka Ernie, Oscar)"


def test_person_with_exact_date_of_birth(person):
    PersonDateOfBirth.objects.create(person=person, year_exact=512)
    assert person.date_of_birth.__str__().endswith("born in 512")


def test_person_with_approx_date_of_birth(person):
    PersonDateOfBirth.objects.create(person=person, year_lower=500, year_upper=525)
    assert person.date_of_birth.__str__().endswith("born c. 500–525")
