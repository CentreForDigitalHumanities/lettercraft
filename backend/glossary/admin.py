from django.contrib import admin
from glossary import models

@admin.register(models.GlossaryItem)
class GlossaryItemAdmin(admin.ModelAdmin):
    list_display = ["term", "category"]
    search_fields = ["term", "description"]
    list_filter = ["category"]

@admin.register(models.GlossaryReference)
class GlossaryReferenceAdmin(admin.ModelAdmin):
    list_display = ["name", "category"]
    search_fields = ["name", "reference"]
    list_filter = ["category"]
