from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description", "series", "key_persons", "key_sites"]
    filter_horizontal = ["series", "key_persons", "key_sites"]
