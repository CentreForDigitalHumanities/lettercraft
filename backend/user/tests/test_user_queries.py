def test_user_query(graphql_client, user, contributor_role, anonymous_request):
    user.profile.role = contributor_role
    user.profile.save()

    query = f"""
    query Test {{
        userDescription(id: "{user.id}") {{ id }}
    }}
    """

    result = graphql_client.execute(query, context=anonymous_request)
    assert result["data"]["userDescription"]["id"] == str(user.id)

    user.profile.role = None
    user.profile.save()

    result = graphql_client.execute(query, context=anonymous_request)
    assert not result["data"]["userDescription"]


def test_user_contributions_query(
    graphql_client, user, user_has_contributor_role, source, episode, agent_description,
    anonymous_request
):
    '''Test contributedSources for users'''
    query = f"""
    query Test {{
        userDescription(id: "{user.id}") {{
            contributedSources {{ id }}
        }}
    }}
    """

    result = graphql_client.execute(query, context=anonymous_request)
    assert len(result["data"]["userDescription"]["contributedSources"]) == 0

    episode.contributors.add(user)
    agent_description.contributors.add(user)

    result = graphql_client.execute(query, context=anonymous_request)
    assert len(result["data"]["userDescription"]["contributedSources"]) == 1
