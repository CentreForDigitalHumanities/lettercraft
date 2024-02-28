from django.contrib import admin
from source.admin import ReferenceInlineAdmin
from . import models


@admin.register(models.PoliticalRegion)
class PoliticalRegion(admin.ModelAdmin):
    pass


@admin.register(models.EcclesiasticalRegion)
class EccleciasticalRegion(admin.ModelAdmin):
    pass


@admin.register(models.GeographicalRegion)
class GeographicalRegionAdmin(admin.ModelAdmin):
    pass


class PoliticalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Political region reference"
    model = models.PoliticalRegionField
    fields = ["space", "political_region", "certainty", "note"]
    extra = 0


class EcclesiasticalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Ecclesiastical region reference"
    model = models.EcclesiasticalRegionField
    fields = ["space", "ecclesiastical_region", "certainty", "note"]
    extra = 0


class GeographicalRegionFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Geographical region reference"
    model = models.GeographicalRegionField
    fields = ["space", "geographical_region", "certainty", "note"]
    extra = 0


class LandscapeFeatureInlineAdmin(admin.StackedInline):
    model = models.LandscapeFeature
    fields = ["landscape", "certainty", "note"]
    extra = 0


class SpotInlineAdmin(admin.StackedInline):
    model = models.Spot
    fields = ["spot", "certainty", "note"]
    extra = 0


@admin.register(models.SpaceDescription)
class SpaceDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description"]
    inlines = [
        PoliticalRegionFieldInlineAdmin,
        EcclesiasticalRegionFieldInlineAdmin,
        GeographicalRegionFieldInlineAdmin,
        LandscapeFeatureInlineAdmin,
        SpotInlineAdmin,
        ReferenceInlineAdmin,
    ]
