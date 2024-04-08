from django.contrib import admin
from . import models


class CaseStudyEpisodeAdmin(admin.StackedInline):
    model = models.Episode.case_studies.through
    extra = 0


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    inlines = [CaseStudyEpisodeAdmin]


@admin.register(models.Episode)
class EpisodeAdmin(admin.ModelAdmin):
    filter_horizontal = ["case_studies", "event_descriptions"]
