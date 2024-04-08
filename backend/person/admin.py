from django.contrib import admin
from django.urls import reverse
from . import models
from django.utils.html import format_html
from core.admin import description_source_fieldset


class AgentNameAdmin(admin.StackedInline):
    model = models.AgentName
    fields = ["value", "certainty", "note"]
    extra = 0
    verbose_name = "Name used in text"
    verbose_name_plural = "Names used in text"


class AgentGenderAdmin(admin.StackedInline):
    model = models.AgentGender
    fields = ["gender", "certainty", "note"]
    extra = 0


class SocialStatusAdmin(admin.StackedInline):
    model = models.SocialStatus
    fields = [
        "status_marker",
        "certainty",
        "note",
        "year_lower",
        "year_upper",
        "year_exact",
    ]
    extra = 0


@admin.register(models.AgentDescription)
class AgentDescriptionAdmin(admin.ModelAdmin):
    inlines = [
        AgentNameAdmin,
        AgentGenderAdmin,
        SocialStatusAdmin,
    ]
    fieldsets = (
        description_source_fieldset,
        (
            "Agent information",
            {
                "fields": [
                    "name",
                    "description",
                    "is_group",
                ]
            },
        ),
    )


class AgentDescriptionInline(admin.StackedInline):
    model = models.AgentDescription.describes.through
    # exclude = ["source", "location", "terminology"]
    # readonly_fields = [
    #     "source_information",
    #     "mention",
    #     "names",
    #     "gender",
    #     "edit",
    # ]
    # extra = 0

    # def source_information(self, obj):
    #     return f"{obj.source} ({obj.location})"

    # def names(self, obj):
    #     names = obj.names.all()
    #     return ", ".join([name.value for name in names])

    # # Creates a link to the edit page of the related AgentDescription object
    # def edit(self, obj):
    #     html = f'<a href="{reverse("admin:person_agentdescription_change", args=[obj.pk])}">Edit</a>'
    #     return format_html(html)


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
        AgentDescriptionInline,
        PersonDateOfBirthAdmin,
        PersonDateOfDeathAdmin,
    ]


@admin.register(models.StatusMarker)
class StatusMarkerAdmin(admin.ModelAdmin):
    pass
