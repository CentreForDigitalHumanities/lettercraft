from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    filter_horizontal = ["authors", "sources"]
