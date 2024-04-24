def test_event_models(event_description, agent_description):
    assert agent_description in event_description.agents.all()
