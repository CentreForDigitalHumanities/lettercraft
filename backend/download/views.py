from rest_framework.views import APIView
from django.http.response import JsonResponse
from source.models import Source

from download.export_json import json_data

class DownloadJSONView(APIView):
    def get(self, request, *args, **kwargs):
        sources = Source.objects.filter(is_public=True)
        data = json_data(sources)
        return JsonResponse(data)
