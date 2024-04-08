from django.db import models
from django.forms import ValidationError
from core.models import (
    Field,
    Historical,
    LettercraftDate,
    SourceDescription,
    DescriptionField,
)


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


class Person(Historical):
    """
    An aggregate model that represents a historical individual.
    This model is based on one or multiple SourceDescriptions and other sources
    that are not part of this database.
    """

    pass


class PersonDateOfBirth(LettercraftDate, Field, models.Model):
    """
    A relationship between a agent and their date of birth.
    """

    person = models.OneToOneField(
        Person,
        related_name="date_of_birth",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        if self.year_exact:
            return f"born in {self.year_exact}"
        else:
            return f"born c. {self.year_lower}–{self.year_upper}"


class PersonDateOfDeath(LettercraftDate, Field, models.Model):
    """ "
    A relationship between a agent and their date of death.
    """

    person = models.OneToOneField(
        Person,
        related_name="date_of_death",
        on_delete=models.CASCADE,
    )

    def __str__(self):
        if self.year_exact:
            return f"died in {self.year_exact}"
        else:
            return f"died c. {self.year_lower}–{self.year_upper}"


class AgentDescription(SourceDescription, models.Model):
    """
    A description of an agent (person or group) in a source.
    """

    describes = models.ManyToManyField(
        to=Person,
        related_name="source_descriptions",
        help_text="Historical individuals that this description refers to. "
        "If the agent is a group, this can be multiple individuals.",
    )

    is_group = models.BooleanField(
        default=False,
        help_text="Whether this entity is a group of people (e.g. 'the nuns of Poitiers'). If true, the date of birth and date of death fields should be left empty.",
    )

    def clean(self):
        if (not self.is_group) and self.describes.count() > 1:
            raise ValidationError("Only groups can include multiple historical figures")

    def __str__(self):
        """
        Inherits the __str__ method from the base model and adds the source to it.
        """
        return f"{super().__str__()} (described in {self.source})"


class AgentName(DescriptionField, models.Model):
    """
    A name used for an agent a source
    """

    agent = models.ForeignKey(
        to=AgentDescription, on_delete=models.CASCADE, related_name="names"
    )
    value = models.CharField(
        max_length=256,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint("value", "agent", name="unique_names_for_agent")
        ]

    def __str__(self):
        return self.value


class Gender(models.TextChoices):
    FEMALE = "FEMALE", "Female"
    MALE = "MALE", "Male"
    UNKNOWN = "UNKNOWN", "Unknown"
    MIXED = "MIXED", "Mixed"
    OTHER = "OTHER", "Other"


class AgentGender(DescriptionField, models.Model):
    """
    An source text's description of an agent's gender.
    """

    agent = models.OneToOneField(
        to=AgentDescription, on_delete=models.CASCADE, related_name="gender"
    )
    gender = models.CharField(
        max_length=8,
        choices=Gender.choices,
        default=Gender.UNKNOWN,
        help_text="The gender of this person or group of people. The option Mixed is ' \
            'only used for groups.",
    )

    def clean(self):
        if self.gender == Gender.MIXED and not self.agent.is_group:
            raise ValidationError("Mixed gender is only applicable to groups")


class SocialStatus(DescriptionField, LettercraftDate, models.Model):
    """
    A relationship between a person or group and a social status marker,
    indicating that the person or group is of a certain social status.
    """

    agent = models.ForeignKey(
        to=AgentDescription, on_delete=models.CASCADE, related_name="social_statuses"
    )
    status_marker = models.ForeignKey(
        to=StatusMarker, on_delete=models.CASCADE, related_name="social_statuses"
    )

    class Meta:
        verbose_name_plural = "Social statuses"

    def __str__(self):
        return f"{self.agent} as {self.status_marker}"
