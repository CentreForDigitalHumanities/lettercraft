from source.models import Source


def test_sources_query(
    graphql_client, user, source, user_request, anonymous_request, contributor_group
):

    other_source = Source.objects.create(name="Pat & Mat")

    result_all = graphql_client.execute(
        "query AllSources { sources { id } }", context=user_request
    )
    ids_from_result = lambda result: [
        int(item["id"]) for item in result["data"]["sources"]
    ]
    assert source.id in ids_from_result(result_all)
    assert other_source.id in ids_from_result(result_all)

    result_editable = graphql_client.execute(
        "query MySources { sources(editable: true) { id } }",
        context=user_request,
    )
    assert source.id in ids_from_result(result_editable)
    assert other_source.id not in ids_from_result(result_editable)

    result_editable_empty = graphql_client.execute(
        "query MySources { sources(editable: true) { id } }",
        context=anonymous_request,
    )
    assert source.id not in ids_from_result(result_editable_empty)
    assert other_source.id not in ids_from_result(result_editable_empty)
