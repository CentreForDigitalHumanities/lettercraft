from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description", "episodes", "key_persons", "key_sites"]
    filter_horizontal = ["episodes", "key_persons", "key_sites"]
