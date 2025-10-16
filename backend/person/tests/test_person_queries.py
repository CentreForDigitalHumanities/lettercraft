def test_agent_query(graphql_client, agent_description, anonymous_request):
    query = f"""
    query Test {{
        agentDescription(id: "{agent_description.id}") {{ id }}
    }}
    """

    result = graphql_client.execute(query, context=anonymous_request)
    assert result["data"]["agentDescription"]["id"] == str(agent_description.id)

    agent_description.source.is_public = False
    agent_description.source.save()

    result = graphql_client.execute(query, context=anonymous_request)
    assert not result["data"]["agentDescription"]

