from django.contrib import admin
from . import models
from core.admin import (
    description_id_fieldset,
    description_source_fieldset,
    description_field_fields,
)


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ["label", "description"]


class LetterMaterialAdmin(admin.StackedInline):
    model = models.LetterMaterial
    fields = ["surface", "certainty", "note"]
    extra = 0

class LetterCategoryAdmin(admin.StackedInline):
    model = models.LetterCategory
    fields = ["letter", "category", "certainty", "note"]
    extra = 0

class LetterSenderDescriptionAdmin(admin.StackedInline):
    model = models.LetterSender
    fields = ["letter", "agent"] + description_field_fields
    extra = 0

class LetterAddresseesDescriptionAdmin(admin.StackedInline):
    model = models.LetterAddressee
    fields = ["letter", "agent"] + description_field_fields
    extra = 0

@admin.register(models.LetterDescription)
class LetterDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    inlines = [
        LetterCategoryAdmin,
        LetterMaterialAdmin,
        LetterSenderDescriptionAdmin,
        LetterAddresseesDescriptionAdmin,
    ]
    fieldsets = (
        description_id_fieldset,
        description_source_fieldset,
    )


class GiftSenderAdmin(admin.StackedInline):
    model = models.GiftSender
    fields = ["gift", "agent"] + description_field_fields
    extra = 0


class GiftMaterialAdmin(admin.StackedInline):
    model = models.GiftMaterial
    fields = ["gift", "material"] + description_field_fields
    extra = 0


@admin.register(models.GiftDescription)
class GiftDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    inlines = [
        GiftSenderAdmin,
        GiftMaterialAdmin,
    ]

    fieldsets = (
        description_id_fieldset,
        description_source_fieldset,
    )
