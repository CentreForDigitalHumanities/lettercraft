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
        "fields": [
            "source",
            "source_location",
            "source_mention",
        ],
    },
)

field_fields = ["certainty", "note"]

description_field_fields = [
    "source_mention",
    "source_location",
    "source_terminology",
] + field_fields
