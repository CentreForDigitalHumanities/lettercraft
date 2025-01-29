import pytest
from django.contrib.auth.models import Group

from source.permissions import can_edit_source


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
        group = Group.objects.create(name="test users")
        user.groups.add(group)
        source.groups.add(group)

    assert can_edit_source(user, source) == has_access
