from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description", "episodes"]
    filter_horizontal = ["episodes"]


@admin.register(models.Episode)
class EpisodeAdmin(admin.ModelAdmin):
    filter_horizontal = ["events"]
