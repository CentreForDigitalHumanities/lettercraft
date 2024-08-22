import pytest
from person.models import PersonReference

def update_agent_body(agent_data: str):
    return f"""
    mutation testMutation {{
        updateAgent(agentData: {{{agent_data}}}) {{
            ok
            errors {{
                field
                messages
            }}
            agent {{
                id
                name
                description
                gender {{
                    gender
                    note
                }}
            }}
        }}
    }}
    """


def assert_agent_data(result, expected_agent):
    data = result["data"]["updateAgent"]
    assert data["ok"] == True
    assert len(data["errors"]) == 0
    assert data["agent"] == expected_agent


def test_update_agent_description(graphql_client, agent_description):
    result = graphql_client.execute(
        update_agent_body(f'id: "{agent_description.pk}", name: "Bertus"')
    )
    assert_agent_data(
        result,
        {
            "id": str(agent_description.id),
            "name": "Bertus",
            "description": "",
            "gender": None,
        },
    )

    result_2 = graphql_client.execute(
        update_agent_body(
            f'id: "{agent_description.pk}", description: "Friend of Ernie"'
        )
    )
    assert_agent_data(
        result_2,
        {
            "id": str(agent_description.id),
            "name": "Bertus",
            "description": "Friend of Ernie",
            "gender": None,
        },
    )

    result_3 = graphql_client.execute(
        update_agent_body(f'id: "{agent_description.pk}", description: ""')
    )
    assert_agent_data(
        result_3,
        {
            "id": str(agent_description.id),
            "name": "Bertus",
            "description": "",
            "gender": None,
        },
    )


def test_update_agent_gender(graphql_client, agent_description):
    add_gender_result = graphql_client.execute(
        update_agent_body(f'id: "{agent_description.pk}", gender: {{ gender: MALE}}')
    )
    assert_agent_data(
        add_gender_result,
        {
            "id": str(agent_description.id),
            "name": "Bert",
            "description": "",
            "gender": {"gender": "MALE", "note": ""},
        },
    )
    update_gender_note_result = graphql_client.execute(
        update_agent_body(
            f'id: "{agent_description.pk}", gender: {{ note: "Blablabla"}}'
        )
    )
    assert_agent_data(
        update_gender_note_result,
        {
            "id": str(agent_description.id),
            "name": "Bert",
            "description": "",
            "gender": {"gender": "MALE", "note": "Blablabla"},
        },
    )

    remove_gender_result = graphql_client.execute(
        update_agent_body(f'id: "{agent_description.id}", gender: null')
    )
    assert_agent_data(
        remove_gender_result,
        {
            "id": str(agent_description.id),
            "name": "Bert",
            "description": "",
            "gender": None,
        },
    )


def test_update_agent_location(graphql_client, agent_description, space_description):
    result = graphql_client.execute(
        update_agent_body(
            f"""id: "{agent_description.id}"
            location: {{ location: "{space_description.id}", note: "!" }}"""
        )
    )
    assert agent_description.location.location == space_description
    assert agent_description.location.note == "!"


@pytest.fixture()
def person_reference(graphql_client, agent_description):
    query_result = graphql_client.execute(
        f"""
        query AgentQuery {{
            agentDescription(id: "{agent_description.id}") {{
                personReferences {{
                    id
                }}
            }}
        }}
        """
    )
    reference = PersonReference.objects.get(
        id=query_result["data"]["agentDescription"]["personReferences"][0]["id"]
    )
    return reference


def test_update_person_reference_mutation(graphql_client, person_reference):
    update_result = graphql_client.execute(
        f"""
        mutation AddReferenceNote {{
            updatePersonReference(referenceData: {{
                id: "{person_reference.id}"
                note: "?"
            }}) {{ ok }}
        }}
        """
    )
    assert update_result["data"]["updatePersonReference"]["ok"]

    person_reference.refresh_from_db()
    assert person_reference.note == "?"


def test_delete_person_reference_mutation(graphql_client, person_reference):
    delete_result = graphql_client.execute(
        f"""
        mutation DeleteReference {{
            deletePersonReference(id: "{person_reference.id}") {{ ok }}
        }}
        """
    )
    assert delete_result["data"]["deletePersonReference"]["ok"]

    with pytest.raises(PersonReference.DoesNotExist):
        person_reference.refresh_from_db()


def test_create_person_reference_mutation(
    graphql_client, agent_description, historical_person, historical_person_2
):
    # create a new reference
    PersonReference.objects.filter(description=agent_description).delete()
    valid_result = graphql_client.execute(
        f"""
        mutation ValidMutation {{
            createPersonReference(referenceData: {{
                person: "{historical_person.id}"
                description: "{agent_description.id}"
            }}) {{ ok }}
        }}
        """
    )
    is_ok = lambda result: result["data"]["createPersonReference"]["ok"]
    assert is_ok(valid_result)
    assert PersonReference.objects.filter(
        description=agent_description, person=historical_person
    ).exists()

    # try creating an existing reference
    already_exists_result = graphql_client.execute(
        f"""
        mutation AlreadyExistsMutation {{
            createPersonReference(referenceData: {{
                person: "{historical_person.id}"
                description: "{agent_description.id}"
            }}) {{ ok }}
        }}
        """
    )

    assert not is_ok(already_exists_result)

    # try adding a (different) reference to an agent that already has an associated person
    description_already_has_reference_result = graphql_client.execute(
        f"""
        mutation AlreadyReferencedMutation {{
            createPersonReference(referenceData: {{
                person: "{historical_person_2.id}"
                description: "{agent_description.id}"
            }}) {{ ok, errors {{ field, messages }} }}
        }}
        """
    )
    assert not is_ok(description_already_has_reference_result)
    assert not PersonReference.objects.filter(
        description=agent_description, person=historical_person_2
    ).exists()
