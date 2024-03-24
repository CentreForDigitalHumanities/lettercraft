from django.contrib import admin
from django.urls import reverse
from . import models
from django.utils.html import format_html
from core.admin import source_information_fieldset, cross_reference_fieldset

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


class StructureFieldInlineAdmin(admin.StackedInline):
    verbose_name = "Structure reference"
    model = models.StructureField
    fields = ["space", "structure", "certainty", "note"]
    extra = 0


class LandscapeFeatureInlineAdmin(admin.StackedInline):
    model = models.LandscapeFeature
    fields = ["landscape", "certainty", "note"]
    extra = 0


@admin.register(models.SpaceDescriptionDescription)
class SpaceDescriptionDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    inlines = [
        PoliticalRegionFieldInlineAdmin,
        EcclesiasticalRegionFieldInlineAdmin,
        GeographicalRegionFieldInlineAdmin,
        StructureFieldInlineAdmin,
        LandscapeFeatureInlineAdmin,
    ]
    fieldsets = (
        source_information_fieldset,
        cross_reference_fieldset,
        (
            "Space description information",
            {
                "fields": [
                    "name",
                    "description",
                ]
            },
        ),
    )


class SpaceDescriptionDescriptionInline(admin.TabularInline):
    model = models.SpaceDescriptionDescription
    fk_name = "target"
    exclude = ["source", "location", "terminology"]
    readonly_fields = ["source_information", "mention", "name", "description", "edit"]
    extra = 0

    def source_information(self, obj):
        return f"{obj.source} ({obj.location})"

    def edit(self, obj):
        html = f'<a href="{reverse("admin:space_spacedescriptiondescription_change", args=[obj.pk])}">Edit</a>'
        return format_html(html)


@admin.register(models.SpaceDescription)
class SpaceDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description"]
    inlines = [
        SpaceDescriptionDescriptionInline,
        PoliticalRegionFieldInlineAdmin,
        EcclesiasticalRegionFieldInlineAdmin,
        GeographicalRegionFieldInlineAdmin,
        StructureFieldInlineAdmin,
        LandscapeFeatureInlineAdmin,
    ]
