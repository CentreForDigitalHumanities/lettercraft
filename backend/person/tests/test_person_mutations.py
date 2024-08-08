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
        update_agent_body(f'id: "{agent_description.pk}", gender: null')
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
