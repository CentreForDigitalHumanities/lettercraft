def test_search_sources_without_term(
    graphql_client, source, source_2, anonymous_request
):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			sourceCount
			sources { name }
		}
	}
	"""
    variables = {
        "focus": "SOURCES",
        "term": "",
        "labelIds": [],
    }
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )

    print("Result:", result["data"])

    assert result["data"]["search"]["sourceCount"] == 2
    assert any(s["name"] == source.name for s in result["data"]["search"]["sources"])


def test_search_sources_with_term(graphql_client, source, source_2, anonymous_request):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			sourceCount
			sources { name }
		}
	}
	"""
    variables = {
        "focus": "SOURCES",
        "term": "Sesame",
        "labelIds": [],
    }
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )
    assert result["data"]["search"]["sourceCount"] == 1
    assert any(s["name"] == source.name for s in result["data"]["search"]["sources"])


def test_search_episodes(graphql_client, episode, anonymous_request):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			episodeCount
			episodes { name }
		}
	}
	"""
    variables = {"focus": "EPISODES", "term": "", "labelIds": []}
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )
    assert result["data"]["search"]["episodeCount"] >= 1
    assert any(e["name"] == episode.name for e in result["data"]["search"]["episodes"])


def test_search_agents(graphql_client, agent_description, anonymous_request):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			agentCount
			agents { name }
		}
	}
	"""
    variables = {"focus": "AGENTS", "term": "Bert", "labelIds": []}
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )
    assert result["data"]["search"]["agentCount"] >= 1
    assert any(
        a["name"] == agent_description.name for a in result["data"]["search"]["agents"]
    )


def test_search_items_letters_and_gifts(
    graphql_client, letter_description, anonymous_request
):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			letterCount
			giftCount
			letters { name }
			gifts { id }
		}
	}
	"""
    variables = {"focus": "ITEMS", "term": "Bert", "labelIds": []}
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )
    assert result["data"]["search"]["letterCount"] >= 1
    assert any(
        l["name"] == letter_description.name
        for l in result["data"]["search"]["letters"]
    )


def test_search_locations(graphql_client, space_description, anonymous_request):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			locationCount
			locations { name }
		}
	}
	"""
    variables = {"focus": "LOCATIONS", "term": "Sesame", "labelIds": []}
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )
    assert result["data"]["search"]["locationCount"] >= 1
    assert any(
        l["name"] == space_description.name
        for l in result["data"]["search"]["locations"]
    )


def test_search_nonexistent_label(graphql_client, source, anonymous_request):
    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			sourceCount
			sources { name }
		}
	}
	"""
    variables = {"focus": "SOURCES", "term": "Sesame", "labelIds": ["999999"]}
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )

    assert result["data"]["search"]["sourceCount"] == 0 or all(
        s["name"] != source.name for s in result["data"]["search"]["sources"]
    )


def test_search_label_filter_episodes(
    graphql_client,
    episode,
    episode_2,
    episode_category_a,
    episode_category_b,
    anonymous_request,
):
    episode.categories.add(episode_category_a)
    episode_2.categories.add(episode_category_b)

    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			episodeCount
			episodes { id name }
		}
	}
	"""
    variables = {
        "focus": "EPISODES",
        "term": "",
        "labelIds": [
            str(episode_category_a.id),
        ],
    }
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )

    assert result["data"]["search"]["episodeCount"] == 1
    assert result["data"]["search"]["episodes"][0]["id"] == str(episode.id)


def test_search_label_filter_sources(
    graphql_client,
    episode_2,
    episode_category_a,
    anonymous_request,
):
    episode_2.categories.add(episode_category_a)

    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			sourceCount
			sources { id name }
		}
	}
	"""
    variables = {
        "focus": "SOURCES",
        "term": "",
        "labelIds": [str(episode_category_a.id)],
    }
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )

    assert result["data"]["search"]["sourceCount"] == 1
    assert result["data"]["search"]["sources"][0]["id"] == str(episode_2.source.id)


def test_search_label_filter_agents(
    graphql_client,
    agent_description,
    episode,
    episode_category_a,
    anonymous_request,
):
    episode = agent_description.source.episode_set.first()
    assert episode is not None
    episode.categories.add(episode_category_a)

    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			agentCount
			agents { name }
		}
	}
	"""
    variables = {
        "focus": "AGENTS",
        "term": "",
        "labelIds": [str(episode_category_a.id)],
    }
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )

    # Both agents are linked to the episode with the label.
    assert result["data"]["search"]["agentCount"] == 2


def test_search_label_and_term_combined(
    graphql_client,
    episode,
    episode_2,
    episode_category_a,
    anonymous_request,
):
    episode_2.categories.add(episode_category_a)

    query = """
	query Search($focus: SearchFocus!, $term: String!, $labelIds: [ID!]!) {
		search(searchFocus: $focus, searchTerm: $term, labelIds: $labelIds) {
			episodeCount
			episodes { id name }
		}
	}
	"""
    variables = {
        "focus": "EPISODES",
        # This matches episode
        "term": "Bert",
        # This matches episode_2
        "labelIds": [str(episode_category_a.id)],
    }
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )

    # Labels and terms are ANDed, so no results expected.
    assert result["data"]["search"]["episodeCount"] == 0

    # Now we make labels and term refer to the same episode (= episode_2)
    variables["term"] = "Ernie"
    result = graphql_client.execute(
        query, variable_values=variables, context=anonymous_request
    )
    assert result["data"]["search"]["episodeCount"] == 1
    assert result["data"]["search"]["episodes"][0]["id"] == str(episode_2.id)
