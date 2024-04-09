from django.contrib import admin
from . import models


# class AgentNameAdmin(admin.StackedInline):
#     model = models.AgentName
#     fields = ["value", "certainty", "note"]
#     extra = 0
#     verbose_name = "(Alternative) agent name"
#     verbose_name_plural = "(Alternative) agent names"


# class SocialStatusAdmin(admin.StackedInline):
#     model = models.SocialStatus
#     fields = ["status_marker", "certainty", "note", "year_lower", "year_upper", "year_exact"]
#     extra = 0


# class AgentDateOfBirthAdmin(admin.StackedInline):
#     model = models.AgentDateOfBirth
#     fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
#     extra = 0


# class AgentDateOfDeathAdmin(admin.StackedInline):
#     model = models.AgentDateOfDeath
#     fields = ["year_lower", "year_upper", "year_exact", "certainty", "note"]
#     extra = 0


# @admin.register(models.Agent)
# class AgentAdmin(admin.ModelAdmin):
#     inlines = [
#         AgentNameAdmin,
#         SocialStatusAdmin,
#         AgentDateOfBirthAdmin,
#         AgentDateOfDeathAdmin,
#     ]


# @admin.register(models.StatusMarker)
# class StatusMarkerAdmin(admin.ModelAdmin):
#     pass
