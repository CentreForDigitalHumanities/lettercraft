from rest_framework import status

from source.models import SourceImage

def test_source_image_view(source_image: SourceImage, client):
    pk = source_image.pk
    response = client.get(f'/api/source-images/{pk}')
    assert response.status_code == status.HTTP_200_OK


def test_source_image_view_not_found(db, client):
    response = client.get(f'/api/source-images/1')
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_source_image_view_private(source_image: SourceImage, client):
    source = source_image.source
    source.is_public = False
    source.save()

    response = client.get(f'/api/source-images/{source_image.pk}')
    assert response.status_code == status.HTTP_404_NOT_FOUND
