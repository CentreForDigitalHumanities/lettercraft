from django.db import models
from django.forms import ValidationError
from core.models import (
    Field,
    LettercraftDate,
    HistoricalEntity,
    EntityDescription,
    DescriptionField,
)

from space.models import SpaceDescription


class HistoricalPerson(HistoricalEntity, models.Model):
    """
    A historical figure, which may be referenced in narrative sources or preserved letters
    """

    pass


class PersonDateOfBirth(Field, LettercraftDate, models.Model):
    person = models.OneToOneField(
        to=HistoricalPerson,
        on_delete=models.CASCADE,
        related_name="date_of_birth",
        help_text="date on which this person was born",
    )

    def __str__(self):
        if self.year_exact:
            return f"{self.person} born in {self.year_exact}"
        else:
            return f"{self.person} born c. {self.year_lower}-{self.year_upper}"


class PersonDateOfDeath(Field, LettercraftDate, models.Model):
    person = models.OneToOneField(
        to=HistoricalPerson,
        on_delete=models.CASCADE,
        related_name="date_of_death",
        help_text="date on which this person died",
    )

    def __str__(self):
        if self.year_exact:
            return f"{self.person} died in {self.year_exact}"
        else:
            return f"{self.person} died c. {self.year_lower}-{self.year_upper}"


class PersonReference(Field, models.Model):
    """
    Link between a historical person and a description in a source text.
    """

    person = models.ForeignKey(
        to=HistoricalPerson,
        on_delete=models.CASCADE,
        related_name="description_references",
    )
    description = models.ForeignKey(
        to="AgentDescription",
        on_delete=models.CASCADE,
        related_name="person_references",
    )

    def __str__(self):
        return f"{self.description} describes {self.person}"


class AgentDescription(EntityDescription, models.Model):
    """
    A description of an agent in a source text; can be a single person or a group
    """

    class Meta:
        ordering = [
            models.F("describes__identifiable").desc(nulls_last=True),
            "is_group",
        ]

    describes = models.ManyToManyField(
        to=HistoricalPerson,
        through=PersonReference,
        blank=True,
        help_text="Historical figure(s) referenced by this description. For groups, this can be multiple people.",
    )

    is_group = models.BooleanField(
        default=False,
        help_text="Whether this agent is a group of people (e.g. 'the nuns of Poitiers').",
    )

    def clean(self):
        # ID check is needed to evaluate the m2m relationship
        if self.id and (not self.is_group) and self.describes.count() > 1:
            raise ValidationError(
                "Only groups can describe multiple historical figures"
            )

    def identified(self):
        return self.describes.filter(identifiable=True).exists()


class Gender(models.TextChoices):
    FEMALE = "FEMALE", "Female"
    MALE = "MALE", "Male"
    UNKNOWN = "UNKNOWN", "Unknown"
    MIXED = "MIXED", "Mixed"
    OTHER = "OTHER", "Other"


class AgentDescriptionGender(DescriptionField, models.Model):
    """
    Characterisation of an agent's gender in a source text description
    """

    agent = models.OneToOneField(
        to=AgentDescription,
        on_delete=models.CASCADE,
        related_name="gender",
    )
    gender = models.CharField(
        max_length=8,
        choices=Gender.choices,
        default=Gender.UNKNOWN,
        help_text="The gender of this agent. The option Mixed is only applicable for groups.",
    )

    class Meta:
        verbose_name = "gender description"

    def __str__(self) -> str:
        return self.gender

    def clean(self):
        if self.gender == Gender.MIXED and not self.agent.is_group:
            raise ValidationError("Mixed gender can only be used for groups")


class AgentDescriptionLocation(DescriptionField, models.Model):
    """
    A characterisation of a location as a fundamental property of an agent.

    May be used for groups ("the nuns of Poitiers").
    """

    agent = models.OneToOneField(
        to=AgentDescription,
        on_delete=models.CASCADE,
        related_name="location",
    )
    location = models.ForeignKey(
        to=SpaceDescription,
        on_delete=models.CASCADE,
        help_text="location by which the agent is identified",
    )

    class Meta:
        verbose_name = "location description"

    def __str__(self):
        return str(self.location)

    def clean(self):
        if self.location.source != self.agent.source:
            raise ValidationError("Can only link descriptions in the same source text")
