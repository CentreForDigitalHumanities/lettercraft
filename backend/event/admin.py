from django.contrib import admin

from . import models
from core.admin import (
    description_id_fieldset,
    description_source_fieldset,
    description_field_fields,
)


class EventDateAdmin(admin.StackedInline):
    model = models.EventDescriptionDate
    fields = ["year_exact", "year_lower", "year_upper"] + description_field_fields
    verbose_name = "date"
    verbose_name_plural = "dates"
    extra = 0


class EventDescriptionAgentAdmin(admin.StackedInline):
    model = models.EventDescriptionAgent
    fields = ["agent"] + description_field_fields
    extra = 0
    verbose_name = "agent"
    verbose_name_plural = "agents involved"


class EventDescriptionLettersAdmin(admin.StackedInline):
    model = models.EventDescriptionLetter
    fields = ["letter"] + description_field_fields
    extra = 0
    verbose_name = "letter"
    verbose_name_plural = "letters"


class EventDescriptionGiftsAdmin(admin.StackedInline):
    model = models.EventDescriptionGift
    fields = ["gift"] + description_field_fields
    extra = 0
    verbose_name = "gift"
    verbose_name_plural = "gifts"


class EventDescriptionSpaceAdmin(admin.StackedInline):
    model = models.EventDescriptionSpace
    fields = ["space"] + description_field_fields
    extra = 0
    verbose_name = "space description"
    verbose_name_plural = "space descriptions"


@admin.register(models.EventDescription)
class EventDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    inlines = [
        EventDescriptionAgentAdmin,
        EventDescriptionLettersAdmin,
        EventDescriptionGiftsAdmin,
        EventDescriptionSpaceAdmin,
        EventDateAdmin,
    ]
    exclude = ["letters", "gifts"]
    fieldsets = (
        description_id_fieldset,
        description_source_fieldset,
    )
