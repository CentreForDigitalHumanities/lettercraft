from django.forms import ValidationError
import pytest
from person.models import PersonDateOfBirth, AgentName, AgentGender, Gender


# def test_agent_name_for_unnamed_agent(agent):
#     assert agent.__str__().startswith("Unknown person #")


# def test_agent_name_for_unnamed_agent_group(agent_group):
#     agent_group.name = ""
#     assert agent_group.__str__().startswith("Unknown group of people #")


# def test_agent_name_for_agent_with_single_name(agent):
#     AgentName.objects.create(agent=agent, value="Bert")
#     assert agent.__str__() == "Bert"


# def test_agent_name_for_agent_with_multiple_names(agent):
#     AgentName.objects.create(agent=agent, value="Bert")
#     AgentName.objects.create(agent=agent, value="Ernie")
#     AgentName.objects.create(agent=agent, value="Oscar")
#     assert agent.__str__() == "Bert (aka Ernie, Oscar)"


def test_agent_with_exact_date_of_birth(person):
    PersonDateOfBirth.objects.create(person=person, year_exact=512)
    assert person.date_of_birth.__str__().endswith("born in 512")


def test_agent_with_approx_date_of_birth(person):
    PersonDateOfBirth.objects.create(person=person, year_lower=500, year_upper=525)
    assert person.date_of_birth.__str__().endswith("born c. 500–525")


def test_agent_group_mixed_gender_constraint(agent_description):
    with pytest.raises(ValidationError):
        gender = AgentGender(agent=agent_description, gender=Gender.MIXED)
        gender.clean()
        gender.save()
