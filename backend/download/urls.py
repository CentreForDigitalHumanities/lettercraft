from django.urls import path
from download.views import DownloadJSONView

urlpatterns = [
    path("download", DownloadJSONView.as_view()),
]
