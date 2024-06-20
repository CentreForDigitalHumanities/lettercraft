from django.contrib import admin

from . import models
from core import admin as core_admin


@admin.register(models.Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ["name", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.Settlement)
class SettlementAdmin(admin.ModelAdmin):
    list_display = ["name", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.Structure)
class StructureAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "identifiable"]
    list_filter = ["identifiable"]


class RegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Region reference"
    model = models.RegionField
    fields = ["space", "region"] + core_admin.description_field_fields
    extra = 0


class SettlementFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Settlement reference"
    model = models.SettlementField
    fields = ["space", "settlement"] + core_admin.description_field_fields
    extra = 0


class StructureFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Structure reference"
    model = models.StructureField
    fields = ["space", "structure"] + core_admin.description_field_fields
    extra = 0


class LandscapeFeatureInlineAdmin(admin.StackedInline):
    model = models.LandscapeFeature
    fields = ["landscape"] + core_admin.description_field_fields
    extra = 0


@admin.register(models.SpaceDescription)
class SpaceDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    fieldsets = [
        core_admin.named_fieldset,
        core_admin.description_source_fieldset,
    ]
    inlines = [
        RegionFieldInlineAdmin,
        SettlementFieldInlineAdmin,
        StructureFieldInlineAdmin,
        LandscapeFeatureInlineAdmin,
    ]
