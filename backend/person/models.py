from django.db import models
from core.models import Field


class Person(models.Model):

    def __str__(self):
        if self.names.count() == 1:
            return self.names.first().value
        elif self.names.count() > 1:
            main_name = self.names.first().value
            aliases = ", ".join(name.value for name in self.names.all()[1:])
            return f"{main_name} (aka {aliases})"
        else:
            return f"Unknown person #{self.id}"


class PersonName(Field, models.Model):
    value = models.CharField(
        max_length=256,
        blank=True,
    )
    person = models.ForeignKey(
        to=Person, 
        on_delete=models.CASCADE, related_name="names"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint("value", "person", name="unique_names_for_person")
        ]

    def __str__(self):
        return self.value
