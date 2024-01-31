from django.contrib import admin
from . import models
from event.admin import EpistolaryEventInline


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    fields = ["name"]
    inlines = [EpistolaryEventInline]
    extra = 0
