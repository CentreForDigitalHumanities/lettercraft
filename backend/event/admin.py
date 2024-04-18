from django.contrib import admin
from . import models
from core import admin as core_admin


@admin.register(models.EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    search_fields = ["name", "description"]


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
    filter_horizontal = ["categories"]
    list_filter = ["source", "categories"]
    fieldsets = [
        core_admin.named_fieldset,
        core_admin.description_source_fieldset,
        (
            "Contents",
            {
                "fields": ["summary", "categories"],
            },
        ),
    ]
    inlines = [
        EventDescriptionAgentAdmin,
        EventDescriptionGiftAdmin,
        EventDescriptionLetterAdmin,
        EventDescriptionSpaceAdmin,
    ]
