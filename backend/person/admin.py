from django.contrib import admin
from source.admin import ReferenceInlineAdmin
from . import models


class PersonNameAdmin(admin.StackedInline):
    model = models.PersonName
    fields = ["value", "certainty", "note"]
    extra = 0
    verbose_name = "(Alternative) person name"
    verbose_name_plural = "(Alternative) person names"


class SocialStatusAdmin(admin.StackedInline):
    model = models.SocialStatus
    fields = ["status_marker", "certainty", "note", "year_lower", "year_upper", "year_exact"]
    extra = 0


class PersonDateOfBirthAdmin(admin.StackedInline):
    model = models.PersonDateOfBirth
    fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
    extra = 0


class PersonDateOfDeathAdmin(admin.StackedInline):
    model = models.PersonDateOfDeath
    fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
    extra = 0


@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [
        PersonNameAdmin,
        SocialStatusAdmin,
        PersonDateOfBirthAdmin,
        PersonDateOfDeathAdmin,
        ReferenceInlineAdmin,
    ]


@admin.register(models.StatusMarker)
class StatusMarkerAdmin(admin.ModelAdmin):
    pass
