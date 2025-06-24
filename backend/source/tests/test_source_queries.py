def test_episode_entity_link_query(
    graphql_client, user_request, contributor_group, source, user, episode
):
    # Adding contributor group as a parameter adds the user to the contributor
    # group of the source as a side-effect.
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
        """,
        context=user_request,
    )
    assert result["data"]["source"]["contributors"]
