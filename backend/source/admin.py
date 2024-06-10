from django.contrib import admin
from . import models
from core import admin as core_admin


class SourceWrittenDateAdmin(admin.StackedInline):
    model = models.SourceWrittenDate
    fields = core_admin.date_fields
    verbose_name = "Date (range) of composition"
    extra = 0


class SourceContentsDateAdmin(admin.StackedInline):
    model = models.SourceContentsDate
    fields = core_admin.date_fields
    verbose_name = "Date (range) of described events"
    extra = 0


@admin.register(models.Source)
class SourceAdmin(admin.ModelAdmin):
    fields = [
        "name",
        "medieval_title",
        "medieval_author",
        "edition_title",
        "edition_author",
    ]
    inlines = [
        SourceWrittenDateAdmin,
        SourceContentsDateAdmin,
    ]
