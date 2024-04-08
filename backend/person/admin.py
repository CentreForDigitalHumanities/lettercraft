from django.contrib import admin
from . import models
from core.admin import (
    description_source_fieldset,
    description_field_fields,
    field_fields,
)


class AgentNameAdmin(admin.StackedInline):
    model = models.AgentName
    fields = ["value"] + description_field_fields
    extra = 0
    verbose_name = "name used in text"
    verbose_name_plural = "names used in text"


class AgentGenderAdmin(admin.StackedInline):
    model = models.AgentGender
    fields = ["gender"] + description_field_fields
    extra = 0


class SocialStatusAdmin(admin.StackedInline):
    model = models.SocialStatus
    fields = ["status_marker"] + description_field_fields
    extra = 0


class PersonReferenceAdmin(admin.StackedInline):
    model = models.PersonDescriptionReference
    fields = ["person", "description"] + field_fields
    extra = 0


@admin.register(models.AgentDescription)
class AgentDescriptionAdmin(admin.ModelAdmin):
    inlines = [
        PersonReferenceAdmin,
        AgentNameAdmin,
        AgentGenderAdmin,
        SocialStatusAdmin,
    ]
    fieldsets = (
        (
            "Identification",
            {
                "fields": [
                    "name",
                    "description",
                    "is_group",
                ]
            },
        ),
        description_source_fieldset,
    )


class PersonDateOfBirthAdmin(admin.StackedInline):
    model = models.PersonDateOfBirth
    fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
    extra = 0


class PersonDateOfDeathAdmin(admin.StackedInline):
    model = models.PersonDateOfDeath
    fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
    extra = 0


@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    fields = ["name", "description"]
    search_fields = ["name", "description"]
    inlines = [
        PersonReferenceAdmin,
        PersonDateOfBirthAdmin,
        PersonDateOfDeathAdmin,
    ]


@admin.register(models.StatusMarker)
class StatusMarkerAdmin(admin.ModelAdmin):
    pass
