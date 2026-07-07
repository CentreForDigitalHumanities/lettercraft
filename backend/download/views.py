from rest_framework.views import APIView
from django.http.response import JsonResponse, FileResponse
from source.models import Source
import io

from download.export_json import json_data
from download.export_docx import save_docx

class DownloadJSONView(APIView):
    def get(self, request, *args, **kwargs):
        sources = Source.objects.filter(is_public=True)
        data = json_data(sources)
        filename = "lettercraft-data.json"
        return JsonResponse(data, headers={
            "Content-disposition": f"attachment; filename=\"{filename}\"",
        })


class DownloadDocxView(APIView):
    def get(self, request, *args, **kwargs):
        sources = Source.objects.filter(is_public=True)
        buffer = io.BytesIO()
        save_docx(sources, buffer)
        buffer.seek(0)
        return FileResponse(buffer, as_attachment=True, filename="lettercraft-data.docx")
