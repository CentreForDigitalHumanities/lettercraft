import os
from django.core.files import File
from rest_framework.status import HTTP_200_OK, HTTP_404_NOT_FOUND

here = os.path.dirname(os.path.abspath(__file__))
img_path = os.path.join(here, 'picture.jpg')

def test_user_get_picture(db, user, contributor_role, client):
    user.profile.picture = File(open(img_path, 'rb'))
    user.profile.save()

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


