from django.contrib import admin
from . import models


class PersonNameAdmin(admin.StackedInline):
    model = models.PersonName
    fields = ["value", "certainty", "note"]
    extra = 0
    verbose_name = "(Alternative) person name"
    verbose_name_plural = "(Alternative) person names"


class OccupationAdmin(admin.StackedInline):
    model = models.Occupation
    fields = ["office", "certainty", "note", "year_lower", "year_upper", "year_exact"]
    extra = 0


@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [PersonNameAdmin, OccupationAdmin]


@admin.register(models.Office)
class Office(admin.ModelAdmin):
    pass
