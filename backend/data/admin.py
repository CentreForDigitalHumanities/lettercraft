from django.contrib import admin
from . import models


class PersonNameAdmin(admin.StackedInline):
    model = models.PersonName
    fields = ['value', 'certainty', 'note']



@admin.register(models.Person)
class PersonAdmin(admin.ModelAdmin):
    inlines = [PersonNameAdmin]


class EpistolaryEventCategoryAdmin(admin.StackedInline):
    model = models.EpistolaryEventCategory
    fields = ['value', 'certainty', 'note']

    extra = 0


class EventDateAdmin(admin.StackedInline):
    model = models.EpistolaryEventDate
    fields = ['year_exact', 'year_lower', 'year_upper', 'certainty', 'note']

class RoleAdmin(admin.StackedInline):
    model = models.Role
    fields = [
        'person',
        'present',
        'role',
        'description',
        'certainty',
        'note',
    ]

    extra = 0


class EventLetterAdmin(admin.StackedInline):
    model = models.EpistolaryEvent.letters.through
    extra = 0

@admin.register(models.EpistolaryEvent)
class EpistolaryEventAdmin(admin.ModelAdmin):
    inlines = [
        EventLetterAdmin,
        EpistolaryEventCategoryAdmin,
        EventDateAdmin,
        RoleAdmin,
    ]

    exclude = ['letters']


class LetterMaterialAdmin(admin.StackedInline):
    model = models.LetterMaterial
    fields = ['surface', 'certainty', 'note']


@admin.register(models.Letter)
class LetterAdmin(admin.ModelAdmin):
    inlines = [
        LetterMaterialAdmin,
        EventLetterAdmin,
    ]
