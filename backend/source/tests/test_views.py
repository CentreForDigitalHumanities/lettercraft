import os
import pytest
from django.core.files.images import ImageFile
from rest_framework import status

from source.models import SourceImage, Source

here = os.path.dirname(os.path.abspath(__file__))

@pytest.fixture()
def source_image(source) -> SourceImage:
    path = os.path.join(here, 'image.jpg')

    with open(path, 'rb') as f:
        image = ImageFile(f, name='image.jpg')
        instance = SourceImage.objects.create(
            source=source,
            image=image,
            alt_text='drawing of an envelope',
            caption='"Letter" by Luka van der Plas, 2025',
        )

    return instance


def test_source_image_view(source_image: SourceImage, client):
    pk = source_image.source.pk
    response = client.get(f'/api/source-images/{pk}')
    assert response.status_code == status.HTTP_200_OK


def test_source_image_view_not_found(source: Source, client):
    response = client.get(f'/api/source-images/{source.pk}')
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_source_image_view_private(source_image: SourceImage, client):
    source = source_image.source
    source.is_public = False
    source.save()

    response = client.get(f'/api/source-images/{source.pk}')
    assert response.status_code == status.HTTP_404_NOT_FOUND
