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
class GiftDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
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
class LetterDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    inlines = [
        LetterDescriptionCategoryAdmin,
        LetterDescriptionSenderAdmin,
        LetterDescriptionAddresseeAdmin,
    ]


class PreservedLetterRoleAdmin(admin.StackedInline):
    model = models.PreservedLetterRole
    fields = ["letter", "person"] + core_admin.field_fields
    extra = 0
    verbose_name = "involved historical person"
    verbose_name_plural = "involved historical persons"


@admin.register(models.PreservedLetter)
class PreservedLetterAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    fields = ["name", "description"]
    inlines = [
        PreservedLetterRoleAdmin,
    ]
