from rest_framework import status

from source.models import SourceImage, Source

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
