def test_event_models(episode, agent_description):
    assert agent_description in episode.agents.all()
