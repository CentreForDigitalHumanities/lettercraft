from rest_framework.views import APIView
from django.http.response import FileResponse
from rest_framework.exceptions import NotFound

from source.models import SourceImage

class SourceImageView(APIView):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')

        try:
            instance = SourceImage.objects.get(pk=pk, source__is_public=True)
        except SourceImage.DoesNotExist:
            raise NotFound('Image not found')

        path = instance.image.path
        return FileResponse(open(path, 'rb'))
