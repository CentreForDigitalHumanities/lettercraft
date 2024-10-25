from event.models import Episode


def test_episode_order_mutation(graphql_client, episode):
    result = graphql_client.execute(
        f"""
        mutation TestMutation {{
            updateEpisodeOrder(
                episodeOrderData: [
                    {{ id: "{episode.id}", rank: 5 }}
                ]
            ) {{
                ok
                errors {{
                    field
                    messages
                }}
            }}
        }}
        """
    )
    assert result["data"]["updateEpisodeOrder"]["ok"] == True
    assert result["data"]["updateEpisodeOrder"]["errors"] == []
    assert Episode.objects.get(id=episode.id).rank == 5
