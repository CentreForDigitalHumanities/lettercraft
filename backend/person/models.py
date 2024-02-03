from django.db import models
from core.models import Field, LettercraftDate


class Office(models.Model):
    """
    A job or position that a person can hold.
    """

    name = models.CharField(
        max_length=256,
        help_text="The name of the office (e.g. 'bishop of Toulouse', 'king of France')",
    )
    description = models.TextField(
        blank=True,
        help_text="A description of the office (e.g. 'The bishop of Toulouse is the ecclesiastical ruler of the diocese of Toulouse')",
    )

    def __str__(self):
        return self.name


class Person(models.Model):
    class Gender(models.TextChoices):
        FEMALE = "FEMALE", "Female"
        MALE = "MALE", "Male"
        UNKNOWN = "UNKNOWN", "Unknown"
        OTHER = "OTHER", "Other"

    gender = models.CharField(
        max_length=8, choices=Gender.choices, default=Gender.UNKNOWN
    )

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
        to=Person, on_delete=models.CASCADE, related_name="names"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint("value", "person", name="unique_names_for_person")
        ]

    def __str__(self):
        return self.value


class PersonDateOfBirth(LettercraftDate, Field, models.Model):
    """
    A relationship between a person and their date of birth.
    """

    person = models.OneToOneField(
        Person, related_name="date_of_birth", on_delete=models.CASCADE
    )

    def __str__(self):
        if self.year_exact:
            return f"{self.person} born in {self.year_exact}"
        else:
            return f"{self.person} born c. {self.year_lower}–{self.year_upper}"


class PersonDateOfDeath(LettercraftDate, Field, models.Model):
    """ "
    A relationship between a person and their date of death.
    """

    person = models.OneToOneField(
        Person, related_name="date_of_death", on_delete=models.CASCADE
    )

    def __str__(self):
        if self.year_exact:
            return f"{self.person} died in {self.year_exact}"
        else:
            return f"{self.person} died c. {self.year_lower}–{self.year_upper}"


class Occupation(Field, LettercraftDate, models.Model):
    """
    A relationship between a person and an occupation.
    """

    person = models.ForeignKey(
        to=Person, on_delete=models.CASCADE, related_name="occupations"
    )
    office = models.ForeignKey(
        to=Office, on_delete=models.CASCADE, related_name="occupations"
    )

    def __str__(self):
        return f"{self.person} as {self.office}"
