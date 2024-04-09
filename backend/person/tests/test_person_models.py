from django.forms import ValidationError
import pytest

from person import models


def test_agent_description_model(agent_description):
    assert str(agent_description) == "Bert (Sesame Street)"


def test_only_groups_can_describe_multiple_people(
    db, agent_description, agent_group_description
):
    person = models.HistoricalPerson.objects.create(name="Elmo")

    agent_group_description.describes.add(person)
    agent_description.clean()

    with pytest.raises(ValidationError):
        agent_description.describes.add(person)
        agent_description.clean()


def test_mixed_gender_only_for_groups(db, agent_description, agent_group_description):
    gender = models.AgentDescriptionGender(
        agent=agent_description,
        gender=models.Gender.MALE,
    )
    gender.clean()

    with pytest.raises(ValidationError):
        gender.gender = models.Gender.MIXED
        gender.clean()

    gender = models.AgentDescriptionGender(
        agent=agent_group_description,
        gender=models.Gender.MIXED,
    )
    gender.clean()


def test_agent_with_exact_date_of_birth(db, historical_person):
    models.PersonDateOfBirth.objects.create(person=historical_person, year_exact=512)
    assert historical_person.date_of_birth.__str__().endswith("born in 512")


def test_agent_with_approx_date_of_birth(db, historical_person):
    models.PersonDateOfBirth.objects.create(
        person=historical_person,
        year_lower=500,
        year_upper=525,
    )
    assert historical_person.date_of_birth.__str__().endswith("born c. 500-525")
