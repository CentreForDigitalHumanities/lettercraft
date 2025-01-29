from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from . import models

@admin.register(models.User)
class UserAdmin(auth_admin.UserAdmin):
    fieldsets = auth_admin.UserAdmin.fieldsets
    fieldsets[2][1]["fields"] = list(fieldsets[2][1]["fields"]) + ["is_contributor_alt"]
    readonly_fields = ["is_contributor_alt"]
