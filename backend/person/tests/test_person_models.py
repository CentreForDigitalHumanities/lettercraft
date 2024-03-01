from django.db import IntegrityError
from django.forms import ValidationError
import pytest
from person.models import AgentDateOfBirth, AgentName, Gender


def test_agent_name_for_unnamed_agent(agent):
    assert agent.__str__().startswith("Unknown agent #")


def test_agent_name_for_unnamed_agent_group(agent_group):
    agent_group.name = ""
    assert agent_group.__str__().startswith("Unknown group of agents #")


def test_agent_name_for_agent_with_single_name(agent):
    AgentName.objects.create(agent=agent, value="Bert")
    assert agent.__str__() == "Bert"


def test_agent_name_for_agent_with_multiple_names(agent):
    AgentName.objects.create(agent=agent, value="Bert")
    AgentName.objects.create(agent=agent, value="Ernie")
    AgentName.objects.create(agent=agent, value="Oscar")
    assert agent.__str__() == "Bert (aka Ernie, Oscar)"


def test_agent_with_exact_date_of_birth(agent):
    AgentDateOfBirth.objects.create(agent=agent, year_exact=512)
    assert agent.date_of_birth.__str__().endswith("born in 512")


def test_agent_with_approx_date_of_birth(agent):
    AgentDateOfBirth.objects.create(agent=agent, year_lower=500, year_upper=525)
    assert agent.date_of_birth.__str__().endswith("born c. 500–525")


def test_agent_group_date_of_birth_constraint(agent_group):
    with pytest.raises(ValidationError):
        AgentDateOfBirth.objects.create(agent=agent_group, year_exact=512)
        agent_group.clean()


def test_agent_group_mixed_gender_constraint(agent_group):
    with pytest.raises(IntegrityError):
        agent_group.gender = Gender.MIXED
        agent_group.save()
