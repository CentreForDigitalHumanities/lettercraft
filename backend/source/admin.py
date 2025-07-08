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

class SourceImageAdmin(admin.StackedInline):
    model = models.SourceImage
    extra = 0
    max_num = 1

@admin.register(models.Source)
class SourceAdmin(admin.ModelAdmin):
    list_filter = ["contributor_groups"]
    list_display = ["name", "is_public"]
    fieldsets = [
        (
            None,
            {
                'fields': ['name', 'is_public'],
            }
        ), (
            'Information for visitors',
            {
                'fields': [
                    'medieval_title',
                    'reference',
                    'description',
                ],
            }
        )
    ]
    inlines = [
        SourceImageAdmin,
        SourceWrittenDateAdmin,
        SourceContentsDateAdmin,
    ]
