import os
import pytest
from django.core.files import File


here = os.path.dirname(os.path.abspath(__file__))

@pytest.fixture()
def image_path() -> str:
    return os.path.join(here, 'tests', 'picture.jpg')

@pytest.fixture()
def user_profile_picture(user, image_path):
    user.profile.picture = File(open(image_path, 'rb'))
    user.profile.save()
    return user.profile.picture
