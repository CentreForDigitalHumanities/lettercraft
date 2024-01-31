from django.db import models
from core.models import Field


class Person(models.Model):
    def __str__(self):
        if self.names.count():
            return self.names.first().value
        else:
            return f"Unknown person #{self.id}"


class PersonName(Field, models.Model):
    value = models.CharField(
        max_length=256,
        null=False,
        blank=True,
    )
    person = models.ForeignKey(
        to=Person,
        on_delete=models.CASCADE,
        null=False,
        related_name="names",
        unique=True,
    )

    def __str__(self):
        return self.value
