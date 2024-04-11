from django.contrib import admin
from . import models
from core import admin as core_admin


class EventDescriptionAgentAdmin(admin.StackedInline):
    model = models.EventDescriptionAgent
    fields = ["agent"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "involved agent"


class EventDescriptionGiftAdmin(admin.StackedInline):
    model = models.EventDescriptionGift
    fields = ["gift"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "involved gift"


class EventDescriptionLetterAdmin(admin.StackedInline):
    model = models.EventDescriptionLetter
    fields = ["letter"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "involved letter"


class EventDescriptionSpaceAdmin(admin.StackedInline):
    model = models.EventDescriptionSpace
    fields = ["space"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "involved space"


@admin.register(models.EventDescription)
class EventDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    inlines = [
        EventDescriptionAgentAdmin,
        EventDescriptionGiftAdmin,
        EventDescriptionLetterAdmin,
        EventDescriptionSpaceAdmin,
    ]
