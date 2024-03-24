from django.contrib import admin
from django.urls import reverse
from . import models
from core.admin import source_information_fieldset, cross_reference_fieldset
from django.utils.html import format_html


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ["label", "description"]


class LetterMaterialAdmin(admin.StackedInline):
    model = models.LetterMaterial
    fields = ["surface", "certainty", "note"]


class LetterCategoryAdmin(admin.StackedInline):
    model = models.LetterCategory
    fields = ["letter", "category", "certainty", "note"]


class LetterSenderAdmin(admin.StackedInline):
    model = models.LetterSenders
    fields = ["letter", "senders", "certainty", "note"]
    filter_horizontal = ["senders"]


class LetterAddresseesAdmin(admin.StackedInline):
    model = models.LetterAddressees
    fields = ["letter", "addressees", "certainty", "note"]
    filter_horizontal = ["addressees"]


@admin.register(models.LetterDescription)
class LetterDescriptionAdmin(admin.ModelAdmin):
    readonly_fields = ["date_active", "date_written"]
    inlines = [
        LetterCategoryAdmin,
        LetterMaterialAdmin,
        LetterSenderAdmin,
        LetterAddresseesAdmin,
    ]
    fieldsets = (
        source_information_fieldset,
        cross_reference_fieldset,
        (
            "Letter information",
            {
                "fields": [
                    "name",
                    "date_active",
                    "date_written",
                ]
            },
        ),
    )


class LetterDescriptionInline(admin.TabularInline):
    model = models.LetterDescription
    fk_name = "target"
    exclude = ["source", "location", "terminology"]
    readonly_fields = [
        "source_information",
        "mention",
        "name",
        "date_active",
        "date_written",
        "edit",
    ]
    extra = 0

    def source_information(self, obj):
        return f"{obj.source} ({obj.location})"

    def edit(self, obj):
        html = f'<a href="{reverse("admin:letter_giftdescription_change", args=[obj.pk])}">Edit</a>'
        return format_html(html)


@admin.register(models.Letter)
class LetterAdmin(admin.ModelAdmin):
    inlines = [
        LetterDescriptionInline,
        LetterCategoryAdmin,
        LetterMaterialAdmin,
        LetterSenderAdmin,
        LetterAddresseesAdmin,
    ]


class GiftLetterActionInline(admin.StackedInline):
    model = models.GiftBase.letter_actions.through
    extra = 0
    verbose_name_plural = "letter actions"
    verbose_name = "relationship between a gift and an associated letter action"


@admin.register(models.GiftDescription)
class GiftDescriptionAdmin(admin.ModelAdmin):
    fieldsets = (
        source_information_fieldset,
        cross_reference_fieldset,
        (
            "Gift information",
            {
                "fields": [
                    "name",
                    "description",
                    "material",
                    "gifted_by",
                ]
            },
        ),
    )
    inlines = [GiftLetterActionInline]


class GiftDescriptionInline(admin.TabularInline):
    model = models.GiftDescription
    fk_name = "target"
    exclude = ["source", "location", "terminology"]
    readonly_fields = [
        "source_information",
        "mention",
        "name",
        "description",
        "material",
        "gifted_by",
        "edit"
    ]
    extra = 0

    def source_information(self, obj):
        return f"{obj.source} ({obj.location})"

    def edit(self, obj):
        html = f'<a href="{reverse("admin:letter_giftdescription_change", args=[obj.pk])}">Edit</a>'
        return format_html(html)


@admin.register(models.Gift)
class GiftAdmin(admin.ModelAdmin):
    fields = ["name", "description", "material", "gifted_by"]
    filter_horizontal = ["letter_actions"]
    inlines = [GiftDescriptionInline, GiftLetterActionInline]
