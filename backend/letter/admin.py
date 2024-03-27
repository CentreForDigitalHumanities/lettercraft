from django.contrib import admin
from django.urls import reverse
from letter.models import Gift
from event.models import LetterAction
from person.models import Agent, AgentDescription
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

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "senders":
            kwargs["queryset"] = Agent.objects.all()
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class LetterSenderDescriptionAdmin(admin.StackedInline):
    model = models.LetterSenders
    fields = ["letter", "senders", "certainty", "note"]
    filter_horizontal = ["senders"]

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "senders":
            kwargs["queryset"] = AgentDescription.objects.all()
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class LetterAddresseesAdmin(admin.StackedInline):
    model = models.LetterAddressees
    fields = ["letter", "addressees", "certainty", "note"]
    filter_horizontal = ["addressees"]

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "addressees":
            kwargs["queryset"] = Agent.objects.all()
        return super().formfield_for_manytomany(db_field, request, **kwargs)


class LetterAddresseesDescriptionAdmin(admin.StackedInline):
    model = models.LetterAddressees
    fields = ["letter", "addressees", "certainty", "note"]
    filter_horizontal = ["addressees"]

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "addressees":
            kwargs["queryset"] = AgentDescription.objects.all()
        return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(models.LetterDescription)
class LetterDescriptionAdmin(admin.ModelAdmin):
    readonly_fields = ["date_active", "date_written"]
    inlines = [
        LetterCategoryAdmin,
        LetterMaterialAdmin,
        LetterSenderDescriptionAdmin,
        LetterAddresseesDescriptionAdmin,
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
        html = f'<a href="{reverse("admin:letter_letterdescription_change", args=[obj.pk])}">Edit</a>'
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

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterAction.objects.all()
        if db_field.name == "giftbase":
            kwargs["queryset"] = Gift.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class GiftLetterActionDescriptionInline(admin.StackedInline):
    model = models.GiftBase.letter_actions.through
    extra = 0
    verbose_name_plural = "letter actions"
    verbose_name = (
        "relationship between a gift description and an associated letter action"
    )

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterAction.objects.all()
        if db_field.name == "giftbase":
            kwargs["queryset"] = Gift.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


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
    inlines = [GiftLetterActionDescriptionInline]

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "gifted_by":
            kwargs["queryset"] = AgentDescription.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


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
        "edit",
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

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "gifted_by":
            kwargs["queryset"] = Agent.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)
