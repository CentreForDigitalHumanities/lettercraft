from django.contrib import admin
from django.urls import reverse
from letter.models import GiftDescription
from event.models import EventDescription
from person.models import AgentDescription
from . import models
from core.admin import description_source_fieldset
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


class LetterSenderDescriptionAdmin(admin.StackedInline):
    model = models.LetterSender
    fields = ["letter", "sender", "certainty", "note"]

    # def formfield_for_manytomany(self, db_field, request, **kwargs):
    #     if db_field.name == "senders":
    #         kwargs["queryset"] = AgentDescription.objects.all()
    #     return super().formfield_for_manytomany(db_field, request, **kwargs)


class LetterAddresseesDescriptionAdmin(admin.StackedInline):
    model = models.LetterAddressee
    fields = ["letter", "addressee", "certainty", "note"]

    # def formfield_for_manytomany(self, db_field, request, **kwargs):
    #     if db_field.name == "addressees":
    #         kwargs["queryset"] = AgentDescription.objects.all()
    #     return super().formfield_for_manytomany(db_field, request, **kwargs)


@admin.register(models.LetterDescription)
class LetterDescriptionAdmin(admin.ModelAdmin):
    inlines = [
        LetterCategoryAdmin,
        LetterMaterialAdmin,
        LetterSenderDescriptionAdmin,
        LetterAddresseesDescriptionAdmin,
    ]
    fieldsets = (
        description_source_fieldset,
        (
            "Letter information",
            {"fields": ["name", "description"]},
        ),
    )


@admin.register(models.GiftDescription)
class GiftDescriptionAdmin(admin.ModelAdmin):
    fields = ["name", "description"]
    # inlines = [GiftDescriptionInline, GiftLetterActionInline]

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "gifted_by":
    #         kwargs["queryset"] = Agent.objects.all()
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)
