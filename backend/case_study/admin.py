from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    filter_horizontal = ["key_figures", "key_sites", "episodes"]

@admin.register(models.Episode)
class EpisodeAdmin(admin.ModelAdmin):
    fields = ["name", "description", "event_descriptions"]
    filter_horizontal = ["event_descriptions"]
