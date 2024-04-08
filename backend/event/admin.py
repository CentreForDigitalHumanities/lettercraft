from django.contrib import admin
from django.urls import reverse

from space.models import SpaceDescription, SpaceDescription
from event.models import EventDescription
from letter.models import GiftDescription, LetterDescription

from . import models
from core.admin import description_source_fieldset
from django.utils.html import format_html


class EventDateAdmin(admin.StackedInline):
    model = models.EventDescriptionDate
    fields = ["year_exact", "year_lower", "year_upper", "certainty", "note"]
    verbose_name = "date"
    verbose_name_plural = "dates"


class EventDescriptionAgentAdmin(admin.StackedInline):
    model = models.EventDescriptionAgent
    fields = [
        "agent",
        "description",
        "certainty",
        "note",
    ]
    extra = 0
    verbose_name = "agent/role"
    verbose_name_plural = "agents/roles involved"


class EventDescriptionLettersAdmin(admin.StackedInline):
    model = models.EventDescriptionLetter
    extra = 0
    verbose_name = "letter"
    verbose_name_plural = "letters"

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "letteractionbase":
    #         kwargs["queryset"] = LetterAction.objects.all()
    #     if db_field.name == "letterbase":
    #         kwargs["queryset"] = Letter.objects.all()
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)


class EventDescriptionGiftsAdmin(admin.StackedInline):
    model = models.EventDescriptionGift
    extra = 0
    verbose_name = "gift"
    verbose_name_plural = "gifts"

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "letteractionbase":
    #         kwargs["queryset"] = LetterAction.objects.all()
    #     if db_field.name == "giftbase":
    #         kwargs["queryset"] = Gift.objects.all()
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)


class EventDescriptionSpaceAdmin(admin.StackedInline):
    model = models.EventDescriptionSpace
    extra = 0
    verbose_name = "space description"
    verbose_name_plural = "space descriptions"

    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == "letteractionbase":
    #         kwargs["queryset"] = LetterAction.objects.all()
    #     if db_field.name == "spacedescriptionbase":
    #         kwargs["queryset"] = SpaceDescription.objects.all()
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(models.EventDescription)
class EventDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    list_filter = ["source"]
    inlines = [
        EventDescriptionAgentAdmin,
        EventDescriptionLettersAdmin,
        EventDescriptionGiftsAdmin,
        EventDescriptionSpaceAdmin,
        EventDateAdmin,
    ]
    exclude = ["letters", "gifts"]
    fieldsets = (description_source_fieldset,)
