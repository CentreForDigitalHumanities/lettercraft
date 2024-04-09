from django.contrib import admin

from . import models
from core import admin as core_admin


@admin.register(models.PoliticalRegion)
class PoliticalRegion(admin.ModelAdmin):
    list_display = ["name", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.EcclesiasticalRegion)
class EccleciasticalRegion(admin.ModelAdmin):
    list_display = ["name", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.GeographicalRegion)
class GeographicalRegionAdmin(admin.ModelAdmin):
    list_display = ["name", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.Structure)
class StructureAdmin(admin.ModelAdmin):
    readonly_fields = ["ancestors_display", "descendants_display"]
    list_display = ["name", "description", "identifiable"]
    list_filter = ["identifiable"]


class PoliticalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Political region reference"
    model = models.PoliticalRegionField
    fields = ["space", "political_region"] + core_admin.description_field_fields
    extra = 0


class EcclesiasticalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Ecclesiastical region reference"
    model = models.EcclesiasticalRegionField
    fields = ["space", "ecclesiastical_region"] + core_admin.description_field_fields
    extra = 0


class GeographicalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Geographical region reference"
    model = models.GeographicalRegionField
    fields = ["space", "geographical_region"] + core_admin.description_field_fields
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
        PoliticalRegionFieldInlineAdmin,
        EcclesiasticalRegionFieldInlineAdmin,
        GeographicalRegionFieldInlineAdmin,
        StructureFieldInlineAdmin,
        LandscapeFeatureInlineAdmin,
    ]
