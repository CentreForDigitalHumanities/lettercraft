from user.models import User, ContributorGroup

def test_user_model(db, user, user_data):
    assert user.username == user_data["username"]


def test_is_contributor(db, user: User, contributor_group: ContributorGroup):
    assert user.is_contributor
    contributor_group.users.remove(user)
    assert not user.is_contributor

def test_user_profile(db, user):
    assert str(user.profile) == user.username
