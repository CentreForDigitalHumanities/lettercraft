from django.contrib import admin
from django.db.models.fields.related import RelatedField
from django.db.models.query import QuerySet
from django.http import HttpRequest
import re


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

contributions_fieldset = ("Contributors", {"fields": ["contributors"]})

date_fields = ["year_lower", "year_upper", "year_exact"]

field_fields = ["certainty", "note"]

description_field_fields = [
    "source_mention",
] + field_fields


class EntityDescriptionAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "source"]
    list_filter = ["source", "contributors"]
    search_fields = ["name", "description"]
    filter_horizontal = ["contributors"]
    fieldsets = [
        named_fieldset,
        contributions_fieldset,
        description_source_fieldset,
    ]


def get_queryset_matching_parent_source(
    admin: admin.StackedInline | admin.TabularInline,
    db_field: RelatedField,
    request: HttpRequest,
) -> QuerySet:
    id_match = re.search(r"\d+", request.path)
    if id_match:
        parent_id = id_match.group(0)
        parent = admin.parent_model.objects.get(id=parent_id)
        return db_field.remote_field.model.objects.filter(source=parent.source)
    else:
        return db_field.remote_field.model.objects.all()
