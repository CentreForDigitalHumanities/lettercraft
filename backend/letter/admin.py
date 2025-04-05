from django.contrib import admin
from . import models
from core import admin as core_admin


@admin.register(models.GiftCategory)
class GiftCategoryAdmin(admin.ModelAdmin):
    fields = ["label", "description"]
    verbose_name = "gift category"
    verbose_name_plural = "gift categories"


@admin.register(models.GiftDescription)
class GiftDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    filter_horizontal = ["categories"]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        fieldsets.append(
            (
                "Gift categories",
                {
                    "description": "Categories assigned to the gift",
                    "fields": ["categories"],
                },
            )
        )
        return fieldsets


@admin.register(models.LetterCategory)
class LetterCategoryAdmin(admin.ModelAdmin):
    fields = ["label", "description"]


@admin.register(models.LetterDescription)
class LetterDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    filter_horizontal = ["categories"]

    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        fieldsets.append(
            (
                "Letter categories",
                {
                    "description": "Categories assigned to the letter",
                    "fields": ["categories"],
                },
            )
        )
        return fieldsets


class PreservedLetterRoleAdmin(admin.StackedInline):
    model = models.PreservedLetterRole
    fields = ["letter", "person"] + core_admin.field_fields
    extra = 0
    verbose_name = "involved historical person"
    verbose_name_plural = "involved historical persons"


@admin.register(models.PreservedLetter)
class PreservedLetterAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description", "contributors"]
    filter_horizontal = ["contributors"]
    inlines = [
        PreservedLetterRoleAdmin,
    ]
