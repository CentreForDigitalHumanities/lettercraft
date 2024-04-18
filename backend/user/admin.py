from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from . import models


class UserProfileAdmin(admin.StackedInline):
    model = models.UserProfile


@admin.register(models.User)
class UserAdmin(auth_admin.UserAdmin):
    inlines = [UserProfileAdmin]
