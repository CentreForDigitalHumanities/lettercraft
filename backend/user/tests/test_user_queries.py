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

