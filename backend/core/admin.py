from django.contrib import admin

named_fieldset = (
    "Name and description",
    {
        "description": "Basic information to help identify this description",
        "fields": ["name", "description"],
    },
)

description_source_fieldset = (
    "Source information",
    {
        "description": "Information about the source from which this description is taken.",
        "fields": ["source", "source_mention", "designators", "book", "chapter", "page"],
    },
)

date_fields = ["year_lower", "year_upper", "year_exact"]

field_fields = ["certainty", "note"]

description_field_fields = [
    "source_mention",
] + field_fields


class EntityDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source"]
    search_fields = ["name", "description"]
    fieldsets = [
        named_fieldset,
        description_source_fieldset,
    ]
