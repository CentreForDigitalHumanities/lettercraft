from django.contrib.auth.models import AnonymousUser
import pytest

from user.permissions import editable_sources, visible_sources, can_edit_source
from user.models import ContributorGroup


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
    assert list(visible_sources(user)) == [source]

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


@pytest.mark.parametrize(
    "is_superuser,in_group,has_access",
    [
        (True, True, True),
        (True, False, True),
        (False, True, True),
        (False, False, False),
    ],
)
def test_source_edit_permission(user, source, is_superuser, in_group, has_access):
    if is_superuser:
        user.is_superuser = True
        user.save()

    if in_group:
        group = ContributorGroup.objects.create(name="test users")
        group.users.add(user)
        group.sources.add(source)

    assert can_edit_source(user, source) == has_access
