import os
import pytest
from django.core.files import File


here = os.path.dirname(os.path.abspath(__file__))
img_path = os.path.join(here, 'tests', 'picture.jpg')

@pytest.fixture()
def user_profile_picture(user):
    user.profile.picture = File(open(img_path, 'rb'))
    user.profile.save()
    return user.profile.picture
