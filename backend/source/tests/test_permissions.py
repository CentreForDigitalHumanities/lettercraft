import pytest
from django.contrib.auth.models import Group

from source.permissions import can_edit_source


@pytest.mark.parametrize(
    "is_superuser,is_contributor,in_group,has_access",
    [
        (True, False, False, True),
        (False, True, True, True),
        (False, True, False, False),
        (False, False, True, False),
        (False, False, False, False),
    ],
)
def test_source_edit_permission(
    user, source, is_superuser, is_contributor, in_group, has_access
):
    if is_superuser:
        user.is_superuser = True
        user.save()

    if is_contributor:
        user.is_contributor = True
        user.save()

    if in_group:
        group = Group.objects.create(name="test users")
        user.groups.add(group)
        source.groups.add(group)

    assert can_edit_source(user, source) == has_access
