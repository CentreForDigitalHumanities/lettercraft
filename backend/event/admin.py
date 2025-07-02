from django.contrib import admin
from . import models
from core import admin as core_admin
from django.http.response import FileResponse
import io
from event.export_designators import export_designators


@admin.register(models.EpisodeCategory)
class EpisodeCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    search_fields = ["name", "description"]

class EpisodeAgentAdmin(admin.StackedInline):
    model = models.EpisodeAgent
    fields = ["agent", "source_mention", "designators", "note"]
    extra = 0
    verbose_name = "involved agent"

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "agent":
            return core_admin.get_queryset_matching_parent_source(
                self, db_field, request
            )

        return super().get_field_queryset(db, db_field, request)


class EpisodeGiftAdmin(admin.StackedInline):
    model = models.EpisodeGift
    fields = ["gift", "source_mention", "designators", "note"]
    extra = 0
    verbose_name = "involved gift"

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "gift":
            return core_admin.get_queryset_matching_parent_source(
                self, db_field, request
            )

        return super().get_field_queryset(db, db_field, request)


class EpisodeLetterAdmin(admin.StackedInline):
    model = models.EpisodeLetter
    fields = ["letter", "source_mention", "designators", "note"]
    extra = 0
    verbose_name = "involved letter"

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "letter" and request:
            return core_admin.get_queryset_matching_parent_source(
                self, db_field, request
            )

        return super().get_field_queryset(db, db_field, request)


class EpisodeSpaceAdmin(admin.StackedInline):
    model = models.EpisodeSpace
    fields = ["space", "source_mention", "designators", "note"]
    extra = 0
    verbose_name = "involved space"

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "space":
            return core_admin.get_queryset_matching_parent_source(
                self, db_field, request
            )

        return super().get_field_queryset(db, db_field, request)


@admin.register(models.Episode)
class EpisodeAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    filter_horizontal = ["categories"]
    list_filter = ["source", "categories"]
    fieldsets = [
        core_admin.named_fieldset,
        core_admin.description_source_fieldset,
        (
            "Contents",
            {
                "fields": ["summary", "designators", "categories"],
            },
        ),
    ]
    inlines = [
        EpisodeAgentAdmin,
        EpisodeGiftAdmin,
        EpisodeLetterAdmin,
        EpisodeSpaceAdmin,
    ]

    actions = ['download_designators']

    @admin.action(description='Download designators from selected episodes')
    def download_designators(self, request, queryset):
        stream = io.StringIO()
        export_designators(queryset, stream)
        bytes_stream = io.BytesIO(stream.getvalue().encode())
        return FileResponse(
            bytes_stream,
            filename='designators.csv',
            as_attachment=True
        )


@admin.register(models.Series)
class SeriesAdmin(admin.ModelAdmin):
    filter_horizontal = ["episodes"]
