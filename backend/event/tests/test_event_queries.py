def test_episode_entity_link_query(graphql_client, episode, agent_description):
    result = graphql_client.execute(
        f"""
        query TestQuery {{
            episodeEntityLink(
                episode: "{episode.id}",
                entity: "{agent_description.id}",
                entityType: AGENT
            ) {{
                id
                episode {{ name }}
                entity {{ name }}
            }}
        }}
        """
    )
    assert result["data"]["episodeEntityLink"]["episode"]["name"] == episode.name
    assert (
        result["data"]["episodeEntityLink"]["entity"]["name"] == agent_description.name
    )
