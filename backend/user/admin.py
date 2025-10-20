from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from . import models

class UserProfileInline(admin.StackedInline):
    model = models.UserProfile
    extra = 0
    max_num = 1

@admin.register(models.User)
class UserAdmin(auth_admin.UserAdmin):
    inlines = [UserProfileInline]


@admin.register(models.ContributorGroup)
class ContributorGroupAdmin(admin.ModelAdmin):
    filter_horizontal = ["users", "sources"]

@admin.register(models.ContributorRole)
class ContributorRoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
