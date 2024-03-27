from django.contrib import admin

# Register your models here.


source_information_fieldset = (
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
)

cross_reference_fieldset = (
    "Cross-reference:",
    {
        "fields": ["target"],
    },
)
