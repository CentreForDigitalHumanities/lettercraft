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
        "person",
        "present",
        "role",
        "description",
        "certainty",
        "note",
    ]
    extra = 0
    verbose_name = "person/role"
    verbose_name_plural = "persons/roles involved"


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


class WorldEventInline(admin.StackedInline):
    model = models.EpistolaryEvent.triggers.through
    extra = 0
    verbose_name = "Triggering world events"
    verbose_name_plural = "Triggering world events"


@admin.register(models.EpistolaryEvent)
class EpistolaryEventAdmin(admin.ModelAdmin):
    fields = ["name", "note"]
    inlines = [
        EpistolaryEventCaseStudyInline,
        EpistolaryEventLetterActionInline,
        WorldEventInline,
    ]


@admin.register(models.WorldEvent)
class WorldEventAdmin(admin.ModelAdmin):
    fields = ["name", "note", "year_exact", "year_lower", "year_upper"]
