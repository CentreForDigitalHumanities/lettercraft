from django.contrib.auth.models import Group
from user.models import User

def test_user_model(db, user, user_data):
    assert user.username == user_data["username"]


def test_is_contributor(db, user: User, source, contributor_group: Group):
    assert user.is_contributor_alt

    contributor_group.sources.remove(source)

    assert not user.is_contributor_alt
