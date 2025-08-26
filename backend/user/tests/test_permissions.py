from django.contrib.auth.models import AnonymousUser
from user.permissions import editable_sources, visible_sources


def test_editable_sources(user, contributor_group, source):
    assert source in editable_sources(user)

    contributor_group.sources.remove(source)
    assert source not in editable_sources(user)
    contributor_group.sources.add(source)

    contributor_group.users.remove(user)
    assert source not in editable_sources(user)


def test_editable_sources_anonymous(source):
    assert editable_sources(AnonymousUser()).exists() is False


def test_visible_sources(user, contributor_group, source):
    assert source in visible_sources(user)

    contributor_group.sources.remove(source)
    assert source in visible_sources(user)

    source.is_public = False
    source.save()
    assert source not in visible_sources(user)


def test_visible_sources_anonymous(source):
    assert source in visible_sources(AnonymousUser())

    source.is_public = False
    source.save()
    assert visible_sources(AnonymousUser()).exists() is False
