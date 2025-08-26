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


def test_episode_entity_link_query_letter(graphql_client, episode, letter_description):
    result = graphql_client.execute(
        f"""
        query TestQuery {{
            episodeEntityLink(
                episode: "{episode.id}",
                entity: "{letter_description.id}",
                entityType: LETTER
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
        result["data"]["episodeEntityLink"]["entity"]["name"] == letter_description.name
    )


def test_episodes_query(graphql_client, episode, anonymous_request):
    query = """
    query AllEpisodes {
        episodes { id }
    }
    """

    result = graphql_client.execute(query, context=anonymous_request)
    assert result["data"]["episodes"] == [{'id': str(episode.id)}]

    episode.source.is_public = False
    episode.source.save()

    result = graphql_client.execute(query, context=anonymous_request)
    assert result["data"]["episodes"] == []
