from django.contrib import admin
from . import models


@admin.register(models.Source)
class SourceAdmin(admin.ModelAdmin):
    fields = [
        "name",
        "medieval_title",
        "medieval_author",
        "edition_title",
        "edition_author",
    ]
