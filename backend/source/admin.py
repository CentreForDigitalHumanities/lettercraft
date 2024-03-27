from django.contrib import admin
from django.contrib.contenttypes.admin import GenericStackedInline
from . import models

@admin.register(models.Source)
class SourceAdmin(admin.ModelAdmin):
    fields = ["name", "bibliographical_info"]
