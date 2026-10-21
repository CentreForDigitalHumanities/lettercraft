from django.contrib import admin
from . import models


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
                    'description_text',
                ],
            }
        )
    ]
    inlines = [
        SourceImageAdmin,
    ]
