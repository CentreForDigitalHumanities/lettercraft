from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from core.models import Field, LettercraftDate
from case_study.models import CaseStudy
from person.models import Person
from letter.models import Letter


class EpistolaryEvent(models.Model):
    """
    Epistolary events are groups of related letter actions that are connected in some way.

    For instance, a political campaign (epistolary event) may consist of the writing, transporting and reading of individual letters (letter actions).
    """

    name = models.CharField(
        max_length=256,
        null=False,
        blank=False,
    )

    case_studies = models.ManyToManyField(
        to=CaseStudy,
        related_name="epistolary_events",
        help_text="case studies this event belongs to",
    )

    note = models.TextField(
        null=False,
        blank=True,
        help_text="Additional notes that describe the event and what connects the letter actions it comprises."
    )

    def __str__(self):
        return f"{self.name}"


class LetterAction(models.Model):
    """
    A letter action is an atomic action performed on a letter, e.g. writing, delivering, reading.

    These can be grouped into epistolary events.
    """

    letters = models.ManyToManyField(
        to=Letter,
        related_name="events",
        help_text="letters involved in this event",
    )

    actors = models.ManyToManyField(
        to=Person,
        through="Role",
        related_name="events",
    )

    epistolary_events = models.ManyToManyField(
        to=EpistolaryEvent,
        related_name="letter_actions",
        help_text="epistolary events this letter action belongs to",
    )

    def __str__(self):
        categories = self.categories.all()
        category_names = [category.get_value_display()
                          for category in categories]
        category_desc = ", ".join(category_names)
        letters = ", ".join(letter.__str__() for letter in self.letters.all())
        return f"{category_desc} of {letters}"


class LetterActionCategory(Field, models.Model):

    class CategoryOptions(models.TextChoices):
        WRITE = "write", "writing"
        TRANSPORT = "transport", "transporting"
        DELIVER = "deliver", "delivering"
        READ = "read", "reading"
        SIGN = "sign", "signing"
        EAT = "eat", "eating"

    value = models.CharField(
        choices=CategoryOptions.choices,
        null=False,
        blank=False,
        help_text="The type of event",
    )

    letter_action = models.ForeignKey(
        to=LetterAction,
        on_delete=models.CASCADE,
        related_name="categories",
        null=False,
        blank=False,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                "value", "letter_action", name="unique_categories_for_letter_action"
            )
        ]
        verbose_name_plural = "letter action categories"

    def __str__(self):
        return f"{self.letter_action}: {self.get_value_display()}"


class LetterEventDate(Field, LettercraftDate, models.Model):

    letter_action = models.OneToOneField(
        to=LetterAction, on_delete=models.CASCADE, related_name="date"
    )

    def __str__(self):
        date = self.year_exact or f"{self.year_lower}–{self.year_upper}"
        return f"{self.letter_action} in {date}"


class Role(Field, models.Model):
    """
    Describes the involvement of a person in a letter action.
    """

    class RoleOptions(models.TextChoices):
        AUTHOR = "author", "Author"
        SCRIBE = "scribe", "Scribe"
        READER = "reader", "Reader"
        WITNESS = "witness", "Witness"
        MESSENGER = "messenger", "Messenger"
        RECIPIENT = "recipient", "Recipient"
        INTENDED_RECIPIENT = "intended_recipient", "Intended recipient"
        AUDIENCE = "audience", "Audience"
        INTENDED_AUDIENCE = "intended_audience", "Intended audience"
        OTHER = "other", "Other"

    person = models.ForeignKey(
        to=Person,
        on_delete=models.CASCADE,
        null=False,
    )
    letter_action = models.ForeignKey(
        to=LetterAction,
        on_delete=models.CASCADE,
        null=False,
    )
    present = models.BooleanField(
        null=False,
        default=True,
        help_text="Whether this person was physically present",
    )
    role = models.CharField(
        choices=RoleOptions.choices,
        null=False,
        blank=False,
        help_text="Role of this person in the event",
    )
    description = models.TextField(
        null=False,
        blank=True,
        help_text="Longer description of this person's involvement",
    )

    def __str__(self):
        return f"role of {self.person} in {self.letter_action}"
