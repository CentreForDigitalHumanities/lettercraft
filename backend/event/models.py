from django.db import models
from django.contrib import admin

from core.models import Field, LettercraftDate
from case_study.models import CaseStudy
# from person.models import Agent
# from letter.models import Gift, Letter
from space.models import SpaceDescription

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

    triggered_world_events = models.ManyToManyField(
        to="WorldEvent",
        through="EpistolaryEventTrigger",
        symmetrical=False,
        related_name="world_event_triggers",
        help_text="World events triggered by this epistolary event",
    )

    triggered_epistolary_events = models.ManyToManyField(
        to="self",
        through="EpistolaryEventSelfTrigger",
        through_fields=("triggering_epistolary_event", "triggered_epistolary_event"),
        symmetrical=False,
        help_text="Other epistolary events triggered by this epistolary event",
    )

    def __str__(self):
        return f"{self.name}"


class LetterAction(models.Model):
    """
    A letter action is an atomic action performed on a letter, e.g. writing, delivering, reading.

    These can be grouped into epistolary events.
    """

    # letters = models.ManyToManyField(
    #     to=Letter,
    #     related_name="events",
    #     help_text="letters involved in this event",
    # )

    # actors = models.ManyToManyField(
    #     to=Agent,
    #     through="Role",
    #     related_name="events",
    # )

    epistolary_events = models.ManyToManyField(
        to=EpistolaryEvent,
        related_name="letter_actions",
        help_text="epistolary events this letter action belongs to",
    )

    # gifts = models.ManyToManyField(
    #     to=Gift,
    #     related_name="letter_actions",
    #     help_text="Gifts associated to this letter action",
    #     blank=True,
    # )

    space_descriptions = models.ManyToManyField(
        to=SpaceDescription,
        help_text="Descriptions of the space in which this action took place",
        blank=True,
    )

    @property
    @admin.display(description="Date")
    def display_date(self):
        return self.date.display_date if hasattr(self, "date") else "unknown date"

    @property
    @admin.display(description="Description")
    def description(self):
        categories = self.categories.all()
        category_names = [category.get_value_display() for category in categories]
        category_desc = ", ".join(category_names)
        letters = ", ".join(letter.__str__() for letter in self.letters.all())
        return f"{category_desc} of {letters}"

    def __str__(self):
        return f"{self.description} ({self.display_date})"


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
        return f"{self.letter_action} ({self.display_date})"


# class Role(Field, models.Model):
#     """
#     Describes the involvement of an agent in a letter action.
#     """

#     class RoleOptions(models.TextChoices):
#         AUTHOR = "author", "Author"
#         SCRIBE = "scribe", "Scribe"
#         READER = "reader", "Reader"
#         WITNESS = "witness", "Witness"
#         MESSENGER = "messenger", "Messenger"
#         RECIPIENT = "recipient", "Recipient"
#         INTENDED_RECIPIENT = "intended_recipient", "Intended recipient"
#         AUDIENCE = "audience", "Audience"
#         INTENDED_AUDIENCE = "intended_audience", "Intended audience"
#         INSTIGATOR = "instigator", "Instigator"
#         OTHER = "other", "Other"

#     agent = models.ForeignKey(
#         to=Agent,
#         on_delete=models.CASCADE,
#         null=False,
#     )
#     letter_action = models.ForeignKey(
#         to=LetterAction,
#         on_delete=models.CASCADE,
#         null=False,
#     )
#     present = models.BooleanField(
#         null=False,
#         default=True,
#         help_text="Whether this agent was physically present",
#     )
#     role = models.CharField(
#         choices=RoleOptions.choices,
#         null=False,
#         blank=False,
#         help_text="Role of this agent in the event",
#     )
#     description = models.TextField(
#         null=False,
#         blank=True,
#         help_text="Longer description of this agent's involvement",
#     )

#     def __str__(self):
#         return f"role of {self.agent} in {self.letter_action}"


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

    triggered_epistolary_events = models.ManyToManyField(
        to=EpistolaryEvent,
        through="WorldEventTrigger",
        symmetrical=False,
        related_name="epistolary_event_triggers",
        help_text="Epistolary events triggered by this world event",
    )

    triggered_world_events = models.ManyToManyField(
        to="self",
        through="WorldEventSelfTrigger",
        through_fields=("triggering_world_event", "triggered_world_event"),
        symmetrical=False,
        help_text="Other world events triggered by this world event",
    )

    def __str__(self):
        return f"{self.name} ({self.display_date})"


class WorldEventTrigger(Field, models.Model):
    """
    A relationship between an epistolary event and a world event where a world event triggers an epistolary event.
    """

    epistolary_event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        related_name="triggers_by_world_events",
        help_text="The epistolary event that was triggered by a world event",
    )

    world_event = models.ForeignKey(
        to=WorldEvent,
        on_delete=models.CASCADE,
        related_name="triggers_for_epistolary_events",
        help_text="The world event that triggered an epistolary event",
    )

    def __str__(self):
        return f"{self.world_event} triggered {self.epistolary_event}"


class EpistolaryEventTrigger(Field, models.Model):
    """
    A relationship between an epistolary event and a world event where an epistolary event triggers a world event.
    """

    epistolary_event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        related_name="triggers_by_epistolary_events",
        help_text="The epistolary event that triggered a world event",
    )

    world_event = models.ForeignKey(
        to=WorldEvent,
        on_delete=models.CASCADE,
        related_name="triggers_for_world_events",
        help_text="The world event that was triggered by an epistolary event",
    )

    def __str__(self):
        return f"{self.epistolary_event} triggered {self.world_event}"


class WorldEventSelfTrigger(Field, models.Model):
    """
    A relationship between a world event and another world event where one world event triggers another.
    """

    triggered_world_event = models.ForeignKey(
        to=WorldEvent,
        on_delete=models.CASCADE,
        related_name="self_triggers_for_world_events",
        help_text="The world event that was triggered by another world event",
    )

    triggering_world_event = models.ForeignKey(
        to=WorldEvent,
        on_delete=models.CASCADE,
        related_name="self_triggered_by_world_events",
        help_text="The world event that triggered another world event",
    )

    def __str__(self):
        return f"{self.triggering_world_event} triggered {self.triggered_world_event}"


class EpistolaryEventSelfTrigger(Field, models.Model):
    """
    A relationship between an epistolary event and another epistolary event where one epistolary event triggers another.
    """

    triggered_epistolary_event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        related_name="self_triggers_for_epistolary_events",
        help_text="The epistolary event that was triggered by another epistolary event",
    )

    triggering_epistolary_event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        related_name="self_triggered_by_epistolary_events",
        help_text="The epistolary event that triggered another epistolary event",
    )

    def __str__(self):
        return f"{self.triggering_epistolary_event} triggered {self.triggered_epistolary_event}"
