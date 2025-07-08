from rest_framework.views import APIView
from django.http.response import FileResponse

from source.models import SourceImage

class SourceImageView(APIView):
    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        instance = SourceImage.objects.get(source__pk=pk)
        path = instance.image.path
        return FileResponse(open(path, 'rb'))
