from django.contrib import admin
from . import models


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
    model = models.LetterAction.letters.through
    extra = 0
    verbose_name = "letter"
    verbose_name_plural = "letters"

class LetterActionGiftsAdmin(admin.StackedInline):
    model = models.LetterAction.gifts.through
    extra = 0
    verbose_name = "gift"
    verbose_name_plural = "gifts"

@admin.register(models.LetterAction)
class LetterActionAdmin(admin.ModelAdmin):
    filter_horizontal = ["epistolary_events", "gifts", "space_descriptions"]
    list_display=["description", "display_date"]
    inlines = [
        LetterActionLettersAdmin,
        LetterActionCategoryAdmin,
        LetterActionGiftsAdmin,
        EventDateAdmin,
        RoleAdmin,
    ]
    exclude = ["letters"]


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
        EpistolaryEventsTriggeredEpistolaryEventsInline
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
        WorldEventsTriggeredWorldEventsInline
    ]
