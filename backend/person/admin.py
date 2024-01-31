from django.contrib import admin
from . import models


class PersonNameAdmin(admin.StackedInline):
    model = models.PersonName
    fields = ["value", "certainty", "note"]


@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [PersonNameAdmin]
