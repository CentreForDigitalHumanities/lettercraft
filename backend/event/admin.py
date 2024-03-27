from django.contrib import admin
from django.urls import reverse

from space.models import SpaceDescription, SpaceDescriptionDescription
from event.models import LetterAction, LetterActionDescription
from letter.models import Gift, GiftDescription, Letter, LetterDescription

from . import models
from core.admin import source_information_fieldset, cross_reference_fieldset
from django.utils.html import format_html


class LetterActionCategoryAdmin(admin.StackedInline):
    model = models.LetterActionCategory
    fields = ["value", "certainty", "note"]
    extra = 0
    verbose_name = "category"
    verbose_name_plural = "categories"


class EventDateAdmin(admin.StackedInline):
    model = models.LetterEventDate
    fields = ["year_exact", "year_lower", "year_upper", "certainty", "note"]
    verbose_name = "date"
    verbose_name_plural = "dates"


class RoleAdmin(admin.StackedInline):
    model = models.Role
    fields = [
        "agent",
        "present",
        "role",
        "description",
        "certainty",
        "note",
    ]
    extra = 0
    verbose_name = "agent/role"
    verbose_name_plural = "agents/roles involved"


class LetterActionLettersAdmin(admin.StackedInline):
    model = models.LetterActionBase.letters.through
    extra = 0
    verbose_name = "letter"
    verbose_name_plural = "letters"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterAction.objects.all()
        if db_field.name == "letterbase":
            kwargs["queryset"] = Letter.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class LetterActionGiftsAdmin(admin.StackedInline):
    model = models.LetterAction.gifts.through
    extra = 0
    verbose_name = "gift"
    verbose_name_plural = "gifts"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterAction.objects.all()
        if db_field.name == "giftbase":
            kwargs["queryset"] = Gift.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class LetterActionSpaceDescriptionAdmin(admin.StackedInline):
    model = models.LetterActionBase.space_descriptions.through
    extra = 0
    verbose_name = "space description"
    verbose_name_plural = "space descriptions"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterAction.objects.all()
        if db_field.name == "spacedescriptionbase":
            kwargs["queryset"] = SpaceDescription.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class LetterActionLettersDescriptionAdmin(admin.StackedInline):
    model = models.LetterActionBase.letters.through
    extra = 0
    verbose_name = "letter"
    verbose_name_plural = "letters"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterActionDescription.objects.all()
        if db_field.name == "letterbase":
            kwargs["queryset"] = LetterDescription.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class LetterActionSpaceDescriptionDescriptionAdmin(admin.StackedInline):
    model = models.LetterActionBase.space_descriptions.through
    extra = 0
    verbose_name = "space description"
    verbose_name_plural = "space descriptions"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterActionDescription.objects.all()
        if db_field.name == "spacedescriptionbase":
            kwargs["queryset"] = SpaceDescriptionDescription.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


class LetterActionGiftsDescriptionAdmin(admin.StackedInline):
    model = models.LetterAction.gifts.through
    extra = 0
    verbose_name = "gift"
    verbose_name_plural = "gifts"

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "letteractionbase":
            kwargs["queryset"] = LetterActionDescription.objects.all()
        if db_field.name == "giftbase":
            kwargs["queryset"] = GiftDescription.objects.all()
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(models.LetterActionDescription)
class LetterActionDescriptionAdmin(admin.ModelAdmin):
    filter_horizontal = ["epistolary_events"]
    list_display = ["description", "display_date"]
    inlines = [
        LetterActionLettersDescriptionAdmin,
        LetterActionGiftsDescriptionAdmin,
        LetterActionSpaceDescriptionDescriptionAdmin,
        LetterActionCategoryAdmin,
        EventDateAdmin,
        RoleAdmin,
    ]
    exclude = ["letters", "gifts"]
    fieldsets = (
        source_information_fieldset,
        cross_reference_fieldset,
        (
            "Letter action information",
            {"fields": ["epistolary_events"]},
        ),
    )


class LetterActionDescriptionInline(admin.TabularInline):
    model = models.LetterActionDescription
    fk_name = "target"
    exclude = ["source", "location", "terminology", "epistolary_events", "letters", "gifts", "space_descriptions"]
    readonly_fields = [
        "source_information",
        "mention",
        "people_involved",
        "letters_involved",
        "gifts_involved",
        "locations_involved",
        "edit",
    ]
    extra = 0

    def source_information(self, obj):
        return f"{obj.source} ({obj.location})"

    def people_involved(self, obj):
        return ", ".join([str(role.agent) for role in obj.roles.all()])

    def letters_involved(self, obj):
        return ", ".join([str(letter) for letter in obj.letters.all()])

    def gifts_involved(self, obj):
        return ", ".join([str(gift) for gift in obj.gifts.all()])

    def locations_involved(self, obj):
        return ", ".join([str(location) for location in obj.space_descriptions.all()])

    def edit(self, obj):
        html = f'<a href="{reverse("admin:event_letteractiondescription_change", args=[obj.pk])}">Edit</a>'
        return format_html(html)


@admin.register(models.LetterAction)
class LetterActionAdmin(admin.ModelAdmin):
    exclude = ["letters", "gifts", "space_descriptions"]
    inlines = [
        LetterActionDescriptionInline,
        LetterActionLettersAdmin,
        LetterActionGiftsAdmin,
        LetterActionSpaceDescriptionAdmin,
        LetterActionCategoryAdmin,
        EventDateAdmin,
        RoleAdmin,
    ]


# For use in Case Study form
class EpistolaryEventInline(admin.StackedInline):
    model = models.CaseStudy.epistolary_events.through
    extra = 0
    verbose_name = "epistolary event"
    verbose_name_plural = "epistolary events"


class EpistolaryEventCaseStudyInline(admin.StackedInline):
    model = models.EpistolaryEvent.case_studies.through
    extra = 0
    verbose_name_plural = "case studies"
    verbose_name = "relationship between a case study and an epistolary event"


class EpistolaryEventLetterActionInline(admin.StackedInline):
    model = models.EpistolaryEvent.letter_actions.through
    extra = 0
    verbose_name_plural = "letter actions"
    verbose_name = "relationship between a epistolary event and a letter action"


class EpistolaryEventsTriggeredWorldEventsInline(admin.StackedInline):
    model = models.EpistolaryEvent.triggered_world_events.through
    fields = ["world_event", "certainty", "note"]
    extra = 0
    verbose_name = "World event triggered by this epistolary event"
    verbose_name_plural = "World events triggered by this epistolary event"


class EpistolaryEventsTriggeredEpistolaryEventsInline(admin.StackedInline):
    model = models.EpistolaryEvent.triggered_epistolary_events.through
    fk_name = "triggering_epistolary_event"
    fields = ["triggered_epistolary_event", "certainty", "note"]
    extra = 0
    verbose_name = "Epistolary event triggered by this epistolary event"
    verbose_name_plural = "Epistolary events triggered by this epistolary event"


@admin.register(models.EpistolaryEvent)
class EpistolaryEventAdmin(admin.ModelAdmin):
    fields = ["name", "note"]
    inlines = [
        EpistolaryEventCaseStudyInline,
        EpistolaryEventLetterActionInline,
        EpistolaryEventsTriggeredWorldEventsInline,
        EpistolaryEventsTriggeredEpistolaryEventsInline,
    ]


class WorldEventsTriggeredEpistolaryEventsInline(admin.StackedInline):
    model = models.WorldEvent.triggered_epistolary_events.through
    fields = ["epistolary_event", "certainty", "note"]
    extra = 0
    verbose_name = "Epistolary event triggered by this world event"
    verbose_name_plural = "Epistolary events triggered by this world event"


class WorldEventsTriggeredWorldEventsInline(admin.StackedInline):
    model = models.WorldEvent.triggered_world_events.through
    fk_name = "triggering_world_event"
    fields = ["triggered_world_event", "certainty", "note"]
    extra = 0
    verbose_name = "World event triggered by this world event"
    verbose_name_plural = "World events triggered by this world event"


@admin.register(models.WorldEvent)
class WorldEventAdmin(admin.ModelAdmin):
    fields = ["name", "note", "year_exact", "year_lower", "year_upper"]
    inlines = [
        WorldEventsTriggeredEpistolaryEventsInline,
        WorldEventsTriggeredWorldEventsInline,
    ]
