from django.db.models.query import QuerySet


def test_episode_order_mutation(
    graphql_client, episode, episode_2, contributor_group, user_request
):
    result = graphql_client.execute(
        f"""
        mutation TestMutation {{
            updateEpisodeOrder(
                episodeIds: [
                    {episode_2.pk}, {episode.pk}
                ]
            ) {{
                ok
                errors {{
                    field
                    messages
                }}
            }}
        }}
        """,
        context=user_request,
    )

    assert result["data"]["updateEpisodeOrder"]["ok"] == True
    assert result["data"]["updateEpisodeOrder"]["errors"] == []

    order_queryset = episode.source.get_episode_order() # type: QuerySet
    ids_list = list(order_queryset.values_list("id", flat=True))

    assert ids_list == [episode_2.pk, episode.pk]
