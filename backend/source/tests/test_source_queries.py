def test_episode_entity_link_query(graphql_client, source, user, episode):
    episode.contributors.add(user)

    result = graphql_client.execute(
        f"""
        query TestQuery {{
            source(
                id: "{source.id}",
            ) {{
                id
                contributors {{ id }}
            }}
        }}
        """
    )
    assert result["data"]["source"]["contributors"]
