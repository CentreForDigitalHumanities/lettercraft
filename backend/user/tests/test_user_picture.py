import os

from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND
from django.core.files import File

def test_user_get_picture(
    db, user, user_profile_picture, contributor_role, client, tmp_media_root
):
    # user is not a contributor so their profile should be private
    response = client.get(f'/users/pictures/{user.pk}/')
    assert response.status_code == HTTP_404_NOT_FOUND

    # assert OK if user is a contributor
    user.profile.role = contributor_role
    user.profile.save()

    response = client.get(f'/users/pictures/{user.pk}/')
    assert response.status_code == HTTP_200_OK

    # user without picture
    user.profile.picture = None
    user.profile.save()

    # user is not a contributor so their profile should be private
    response = client.get(f'/users/pictures/{user.pk}/')
    assert response.status_code == HTTP_404_NOT_FOUND


def test_profile_picture_file_cleanup(db, user, image_path, tmp_media_root):
    dir = tmp_media_root / 'profile_pictures'

    def assert_single_file():
        assert os.listdir(dir) == [f'{user.profile.pk}.jpg']

    def assert_no_file():
        assert os.listdir(dir) == [f'{user.profile.pk}.jpg']

    user.profile.picture = File(open(image_path, 'rb'))
    user.profile.save()
    assert_single_file()

    user.profile.save()
    assert_single_file()

    user.profile.picture = File(open(image_path, 'rb'))
    user.profile.save()
    assert_single_file()

    user.profile.picture = None
    user.profile.save()
    assert_no_file()

    user.profile.picture = File(open(image_path, 'rb'))
    user.profile.save()
    assert_single_file()

    user.delete()
    assert_no_file()
