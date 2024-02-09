from django.db import models

from core.models import Field, LettercraftDate
from case_study.models import CaseStudy
from person.models import Person
from letter.models import Gift, Letter


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
        help_text="Additional notes that describe the event and what connects the letter actions it comprises.",
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

    gifts = models.ManyToManyField(
        to=Gift,
        related_name="letter_actions",
        help_text="Gifts associated to this letter action",
    )

    def __str__(self):
        categories = self.categories.all()
        category_names = [category.get_value_display()
                          for category in categories]
        category_desc = ", ".join(category_names)
        letters = ", ".join(letter.__str__() for letter in self.letters.all())
        return f"{category_desc} of {letters} ({self.date.display_date})"


class LetterActionCategory(Field, models.Model):
    value = models.CharField(
        choices=[
            ("write", "writing"),
            ("transport", "transporting"),
            ("deliver", "delivering"),
            ("read", "reading"),
            ("sign", "signing"),
            ("eat", "eating"),
        ],
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
        return f"{self.letter_action} ({self.display_date})"


class Role(Field, models.Model):
    """
    Describes the involvement of a person in a letter action.
    """

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
        choices=[
            ("author", "Author"),
            ("scribe", "Scribe"),
            ("reader", "Reader"),
            ("witness", "Witness"),
            ("messenger", "Messenger"),
            ("recipient", "Recipient"),
            ("intended_recipient", "Intended recipient"),
            ("audience", "Audience"),
            ("intended_audience", "Intended audience"),
            ("instigator", "Instigator"),
            ("other", "Other"),
        ],
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


class WorldEvent(LettercraftDate, models.Model):
    """
    World events are events that are not directly related to a specific letter
    or letter action, but are relevant to the context of the letters.
    """

    name = models.CharField(
        max_length=256,
        null=False,
        blank=False,
        help_text="The name of the event, e.g. 'The Great Fire of London' or 'The Battle of Hastings'.",
    )

    note = models.TextField(
        null=False,
        blank=True,
        help_text="Additional notes that describe the event and its relevance to the letters.",
    )

    epistolary_events = models.ManyToManyField(
        to=EpistolaryEvent,
        through="EpistolaryEventTrigger",
        related_name="triggers",
    )

    def __str__(self):
        return f"{self.name} ({self.display_date})"


class EpistolaryEventTrigger(models.Model):
    """
    A relationship between an epistolary event and a world event that triggered it.
    """

    epistolary_event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        help_text="The epistolary event that was triggered by a world event",
    )

    world_event = models.ForeignKey(
        to=WorldEvent,
        on_delete=models.CASCADE,
        help_text="The world event that triggered an epistolary event",
    )

    def __str__(self):
        return f"{self.world_event} triggered {self.epistolary_event}"
