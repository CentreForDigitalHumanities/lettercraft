from django.contrib import admin
from . import models


class LetterMaterialAdmin(admin.StackedInline):
    model = models.LetterMaterial
    fields = ["surface", "certainty", "note"]


@admin.register(models.Letter)
class LetterAdmin(admin.ModelAdmin):
    inlines = [
        LetterMaterialAdmin,
    ]
