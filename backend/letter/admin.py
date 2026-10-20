from django.contrib import admin
from . import models
from core import admin as core_admin


@admin.register(models.GiftDescription)
class GiftDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    pass


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
