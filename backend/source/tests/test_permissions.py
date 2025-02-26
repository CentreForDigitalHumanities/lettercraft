import pytest

from user.permissions import can_edit_source
from user.models import ContributorGroup


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
