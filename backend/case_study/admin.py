from django.contrib import admin
from . import models


@admin.register(models.CaseStudy)
class CaseStudyAdmin(admin.ModelAdmin):
    fields = ["name"]
    inlines = []
    extra = 0
