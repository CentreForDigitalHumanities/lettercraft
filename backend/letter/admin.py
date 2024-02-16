from django.contrib import admin
from source.admin import ReferenceInlineAdmin
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


class LetterSenderAdmin(admin.StackedInline):
    model = models.LetterSenders
    fields = ["letter", "senders", "certainty", "note"]
    filter_horizontal = ["senders"]


class LetterAddresseesAdmin(admin.StackedInline):
    model = models.LetterAddressees
    fields = ["letter", "addressees", "certainty", "note"]
    filter_horizontal = ["addressees"]


@admin.register(models.Letter)
class LetterAdmin(admin.ModelAdmin):
    readonly_fields = ["date_active", "date_written"]
    inlines = [
        LetterCategoryAdmin,
        LetterMaterialAdmin,
        LetterSenderAdmin,
        LetterAddresseesAdmin,
        ReferenceInlineAdmin,
    ]
