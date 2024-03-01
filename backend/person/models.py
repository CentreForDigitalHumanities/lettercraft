from django.db import models
from django.forms import ValidationError
from core.models import Field, LettercraftDate
from django.db.models import Q, CheckConstraint


class StatusMarker(models.Model):
    """
    A marker of someone's social status. This can be a job title or a social group someone belongs to.
    """

    name = models.CharField(
        max_length=256,
        help_text="The name of the marker or job (e.g. 'bishop of Toulouse', 'peasantry of France')",
    )
    description = models.TextField(
        blank=True,
        help_text="A description of what the marker means (e.g. 'The bishop of Toulouse is the ecclesiastical ruler of the diocese of Toulouse')",
    )

    def __str__(self):
        return self.name


class Gender(models.TextChoices):
    FEMALE = "FEMALE", "Female"
    MALE = "MALE", "Male"
    UNKNOWN = "UNKNOWN", "Unknown"
    MIXED = "MIXED", "Mixed"
    OTHER = "OTHER", "Other"


class Person(models.Model):
    gender = models.CharField(
        max_length=8,
        choices=Gender.choices,
        default=Gender.UNKNOWN,
        help_text="The gender of this person or the group members. The option Mixed is only used for groups.",
    )

    is_group = models.BooleanField(
        default=False,
        help_text="Whether this entity is a group of people (e.g. 'the nuns of Poitiers') or a single person.",
    )

    class Meta:
        constraints = [
            CheckConstraint(
                check=~Q(gender=Gender.MIXED, is_group=True),
                name="gender_group_constraint",
                violation_error_message="The 'mixed' gender option is reserved for groups",
            )
        ]

    def clean(self):
        if self.is_group and getattr(self, "date_of_birth", None) is not None:
            raise ValidationError("A group cannot have a date of birth")

        if self.is_group and getattr(self, "date_of_death", None) is not None:
            raise ValidationError("A group cannot have a date of death")

    def __str__(self):
        if self.names.count() == 1:
            return self.names.first().value
        elif self.names.count() > 1:
            main_name = self.names.first().value
            aliases = ", ".join(name.value for name in self.names.all()[1:])
            return f"{main_name} (aka {aliases})"
        else:
            return f"Unknown {'person' if self.is_group is False else 'group of people'} #{self.id}"


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


class SocialStatus(Field, LettercraftDate, models.Model):
    """
    A relationship between a person or group and a social status marker,
    indicating that the person or group is of a certain social status.
    """

    person = models.ForeignKey(
        to=Person, on_delete=models.CASCADE, related_name="social_statuses"
    )
    status_marker = models.ForeignKey(
        to=StatusMarker, on_delete=models.CASCADE, related_name="social_statuses"
    )

    class Meta:
        verbose_name_plural = "Social statuses"

    def __str__(self):
        return f"{self.person} as {self.status_marker}"
