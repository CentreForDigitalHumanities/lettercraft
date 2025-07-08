import os
import pytest
from django.core.files.images import ImageFile

from source.models import SourceImage

here = os.path.dirname(os.path.abspath(__file__))

@pytest.fixture()
def source_image(source) -> SourceImage:
    path = os.path.join(here, 'tests', 'image.jpg')

    with open(path, 'rb') as f:
        image = ImageFile(f, name='image.jpg')
        instance = SourceImage.objects.create(
            source=source,
            image=image,
            alt_text='drawing of an envelope',
            caption='"Letter" by Luka van der Plas, 2025',
        )

    return instance
