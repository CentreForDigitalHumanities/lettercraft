from django.contrib import admin
from . import models


class PersonNameAdmin(admin.StackedInline):
    model = models.PersonName
    fields = ["value", "certainty", "note"]
    extra = 0
    verbose_name = "(Alternative) person name"
    verbose_name_plural = "(Alternative) person names"

@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [PersonNameAdmin]
