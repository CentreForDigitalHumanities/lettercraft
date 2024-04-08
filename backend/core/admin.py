from django.contrib import admin

# Register your models here.


description_source_fieldset = (
    "Source information",
    {
        "description": "Information about the source from which this description is taken.",
        "fields": [
            "source",
            "location",
            "mention",
        ],
    },
)

field_fields = ["certainty", "note"]

description_field_fields = [
    "mention",
    "location",
    "terminology",
] + field_fields
