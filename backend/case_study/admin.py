from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Episode)
class EpisodeAdmin(admin.ModelAdmin):
    pass
