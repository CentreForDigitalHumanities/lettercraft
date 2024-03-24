from django.contrib import admin
from django.urls import reverse
from . import models
from django.utils.html import format_html


class AgentNameAdmin(admin.StackedInline):
    model = models.AgentName
    fields = ["value", "certainty", "note"]
    extra = 0
    verbose_name = "(Alternative) agent name"
    verbose_name_plural = "(Alternative) agent names"


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


class AgentDateOfBirthAdmin(admin.StackedInline):
    model = models.AgentDateOfBirth
    fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
    extra = 0


class AgentDateOfDeathAdmin(admin.StackedInline):
    model = models.AgentDateOfDeath
    fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
    extra = 0


@admin.register(models.AgentDescription)
class AgentDescriptionAdmin(admin.ModelAdmin):
    inlines = [
        AgentNameAdmin,
        SocialStatusAdmin,
        AgentDateOfBirthAdmin,
        AgentDateOfDeathAdmin,
    ]
    fieldsets = (
        (
            "Source information",
            {
                "description": "Information about the source from which this description is taken.",
                "fields": [
                    "source",
                    "location",
                    "terminology",
                    "mention",
                ],
            },
        ),
        (
            "Cross-reference:",
            {
                "fields": ["target"],
            },
        ),
        (
            "Agent information",
            {
                "fields": [
                    "gender",
                    "is_group",
                ]
            },
        ),
    )


class AgentDescriptionInline(admin.TabularInline):
    model = models.AgentDescription
    fk_name = "target"
    exclude = ["source", "location", "terminology"]
    readonly_fields = [
        "source_information",
        "mention",
        "names",
        "life_span",
        "gender",
        "edit",
    ]
    extra = 0

    def source_information(self, obj):
        return f"{obj.source} ({obj.location})"

    def names(self, obj):
        names = obj.names.all()
        return ", ".join([name.value for name in names])

    def life_span(self, obj):
        return f"{obj.date_of_birth} – {obj.date_of_death}"

    # Creates a link to the edit page of the related AgentDescription object
    def edit(self, obj):
        html = f'<a href="{reverse("admin:person_agentdescription_change", args=[obj.pk])}">Edit</a>'
        return format_html(html)


@admin.register(models.Agent)
class AgentAdmin(admin.ModelAdmin):
    search_fields = ["names__value"]
    inlines = [
        AgentDescriptionInline,
        AgentNameAdmin,
        SocialStatusAdmin,
        AgentDateOfBirthAdmin,
        AgentDateOfDeathAdmin,
    ]


@admin.register(models.StatusMarker)
class StatusMarkerAdmin(admin.ModelAdmin):
    pass
