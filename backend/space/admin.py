from django.contrib import admin
from . import models
from core.admin import description_source_fieldset, description_field_fields

@admin.register(models.PoliticalRegion)
class PoliticalRegion(admin.ModelAdmin):
    list_display = ["name", "description", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.EcclesiasticalRegion)
class EccleciasticalRegion(admin.ModelAdmin):
    list_display = ["name", "description", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.GeographicalRegion)
class GeographicalRegionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "identifiable"]
    list_filter = ["identifiable"]


@admin.register(models.Structure)
class StructureAdmin(admin.ModelAdmin):
    readonly_fields = ["ancestors_display", "descendants_display"]
    list_display = ["name", "description", "identifiable"]
    list_filter = ["identifiable"]


class PoliticalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Political region reference"
    model = models.PoliticalRegionField
    fields = ["space", "political_region"] + description_field_fields
    extra = 0


class EcclesiasticalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Ecclesiastical region reference"
    model = models.EcclesiasticalRegionField
    fields = ["space", "ecclesiastical_region"] + description_field_fields
    extra = 0


class GeographicalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Geographical region reference"
    model = models.GeographicalRegionField
    fields = ["space", "geographical_region"] + description_field_fields
    extra = 0


class StructureFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Structure reference"
    model = models.StructureField
    fields = ["space", "structure"] + description_field_fields
    extra = 0


class LandscapeFeatureInlineAdmin(admin.StackedInline):
    model = models.LandscapeFeature
    fields = ["landscape"] + description_field_fields
    extra = 0


@admin.register(models.SpaceDescription)
class SpaceDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    inlines = [
        PoliticalRegionFieldInlineAdmin,
        EcclesiasticalRegionFieldInlineAdmin,
        GeographicalRegionFieldInlineAdmin,
        StructureFieldInlineAdmin,
        LandscapeFeatureInlineAdmin,
    ]
    fieldsets = (
        (
            "Space description information",
            {
                "fields": [
                    "name",
                    "description",
                ]
            },
        ),
        description_source_fieldset,
    )
