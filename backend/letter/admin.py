from django.contrib import admin
from . import models
from core import admin as core_admin


@admin.register(models.GiftCategory)
class GiftCategoryAdmin(admin.ModelAdmin):
    pass


class GiftDescriptionCategoryAdmin(admin.StackedInline):
    model = models.GiftDescriptionCategory
    fields = ["category"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "category"
    verbose_name_plural = "categories"


class GiftDescriptionSenderAdmin(admin.StackedInline):
    model = models.GiftDescriptionSender
    fields = ["agent"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "sender"


class GiftDescriptionAddresseeAdmin(admin.StackedInline):
    model = models.GiftDescriptionAddressee
    fields = ["agent"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "addressee"


@admin.register(models.GiftDescription)
class GiftDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    fieldsets = [
        core_admin.named_fieldset,
        core_admin.description_source_fieldset,
    ]
    inlines = [
        GiftDescriptionCategoryAdmin,
        GiftDescriptionSenderAdmin,
        GiftDescriptionAddresseeAdmin,
    ]


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    fields = ["label", "description"]


class LetterDescriptionCategoryAdmin(admin.StackedInline):
    model = models.LetterDescriptionCategory
    fields = ["category"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "category"
    verbose_name_plural = "categories"


class LetterDescriptionSenderAdmin(admin.StackedInline):
    model = models.LetterDescriptionSender
    fields = ["agent"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "sender"


class LetterDescriptionAddresseeAdmin(admin.StackedInline):
    model = models.LetterDescriptionAddressee
    fields = ["agent"] + core_admin.description_field_fields
    extra = 0
    verbose_name = "addressee"


@admin.register(models.LetterDescription)
class LetterDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    fieldsets = [
        core_admin.named_fieldset,
        core_admin.description_source_fieldset,
    ]
    inlines = [
        LetterDescriptionCategoryAdmin,
        LetterDescriptionSenderAdmin,
        LetterDescriptionAddresseeAdmin,
    ]
