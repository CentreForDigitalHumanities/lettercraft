from django.urls import path
from download.views import DownloadJSONView, DownloadDocxView

urlpatterns = [
    path("download-json", DownloadJSONView.as_view()),
    path("download-docx", DownloadDocxView.as_view()),
]
