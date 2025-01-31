from django.contrib import admin
from django.db.models.fields.related import RelatedField
from django.db.models.query import QuerySet
from django.http import HttpRequest
from typing import Optional

from . import models
from core import admin as core_admin


class PersonDateOfBirthAdmin(admin.StackedInline):
    model = models.PersonDateOfBirth
    fields = core_admin.date_fields + core_admin.field_fields
    extra = 0


class PersonDateOfDeathAdmin(admin.StackedInline):
    model = models.PersonDateOfDeath
    fields = core_admin.date_fields + core_admin.field_fields
    extra = 0


class PersonReferenceAdmin(admin.StackedInline):
    model = models.PersonReference
    fields = ["person", "description"] + core_admin.field_fields
    extra = 0


@admin.register(models.HistoricalPerson)
class HistoricalPersonAdmin(admin.ModelAdmin):
    list_display = ["name", "description"]
    search_fields = ["name", "description"]
    filter_horizontal = ["contributors"]
    list_filter = ["contributors"]
    fieldsets = [
        core_admin.named_fieldset,
        core_admin.contributions_fieldset,
    ]
    inlines = [
        PersonDateOfBirthAdmin,
        PersonDateOfDeathAdmin,
        PersonReferenceAdmin,
    ]


class AgentDescriptionGenderAdmin(admin.StackedInline):
    model = models.AgentDescriptionGender
    fields = ["gender"] + core_admin.description_field_fields
    extra = 0

class AgentDescriptionLocationAdmin(admin.StackedInline):
    model = models.AgentDescriptionLocation
    fields = ["location"] + core_admin.description_field_fields
    extra = 0

    def get_field_queryset(
        self, db, db_field: RelatedField, request: Optional[HttpRequest]
    ) -> Optional[QuerySet]:
        if db_field.name == "location" and request:
            return core_admin.get_queryset_matching_parent_source(
                self, db_field, request
            )

        return super().get_field_queryset(db, db_field, request)


@admin.register(models.AgentDescription)
class AgentDescriptionAdmin(core_admin.EntityDescriptionAdmin, admin.ModelAdmin):
    fieldsets = [
        core_admin.named_fieldset,
        ("Person/group", {"fields": ["is_group"]}),
        core_admin.description_source_fieldset,
    ]
    inlines = [
        AgentDescriptionGenderAdmin,
        AgentDescriptionLocationAdmin,
        PersonReferenceAdmin,
    ]
