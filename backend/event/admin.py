from typing import Any
from django.contrib import admin
from . import models
from core import admin as core_admin


@admin.register(models.EpisodeCategory)
class EpisodeCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    search_fields = ["name", "description"]


class EpisodeAgentAdmin(admin.StackedInline):
    model = models.EpisodeAgent
    fields = ["agent"] + core_admin.description_field_fields
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
    fields = ["gift"] + core_admin.description_field_fields
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
    fields = ["letter"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "involved letter"

    def get_field_queryset(self, db, db_field, request):
        if db_field.name == "letter":
            return core_admin.get_queryset_matching_parent_source(
                self, db_field, request
            )

        return super().get_field_queryset(db, db_field, request)


class EpisodeSpaceAdmin(admin.StackedInline):
    model = models.EpisodeSpace
    fields = ["space"] + core_admin.description_field_fields
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
                "fields": ["summary", "categories"],
            },
        ),
    ]
    inlines = [
        EpisodeAgentAdmin,
        EpisodeGiftAdmin,
        EpisodeLetterAdmin,
        EpisodeSpaceAdmin,
    ]


@admin.register(models.Series)
class SeriesAdmin(admin.ModelAdmin):
    filter_horizontal = ["episodes"]
