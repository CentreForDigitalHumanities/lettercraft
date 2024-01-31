from django.contrib import admin
from . import models


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ["label", "description"]


class LetterMaterialAdmin(admin.StackedInline):
    model = models.LetterMaterial
    fields = ["surface", "certainty", "note"]


class LetterCategoryAdmin(admin.StackedInline):
    model = models.LetterCategory
    fields = ["letter", "category", "certainty", "note"]


@admin.register(models.Letter)
class LetterAdmin(admin.ModelAdmin):
    inlines = [
        LetterCategoryAdmin,
        LetterMaterialAdmin,
    ]
