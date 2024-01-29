from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Field(models.Model):
    certainty = models.IntegerField(
        choices=[
            (0, "uncertain"),
            (1, "somewhat certain"),
            (2, "certain"),
        ],
        default=2,
        help_text="How certain are you of this value?",
    )

    note = models.TextField(
        null=False,
        blank=True,
        help_text="Additional notes",
    )

    class Meta:
        abstract = True


class Letter(models.Model):
    def __str__(self):
        return f"letter #{self.id}"


class LetterMaterial(Field, models.Model):
    surface = models.CharField(
        choices=[
            ("parchment", "parchment"),
            ("papyrus", "papyrus"),
            ("other", "other"),
            ("unknown", "unknown"),
        ],
        null=False,
        blank=False,
    )
    letter = models.OneToOneField(
        to=Letter,
        on_delete=models.CASCADE,
        null=False,
    )

    def __str__(self):
        if self.letter:
            return f"material of {self.letter}"
        else:
            return f"material #{self.id}"


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


class CaseStudy(models.Model):
    """
    A case study is an overarching collection of epistolary events, bound together by a common theme, e.g. `The Saga of St. Boniface` or `The  Nun Rebellion of Poitiers`.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"

    name = models.CharField(
        max_length=256,
        null=False,
        blank=False,
    )

    def __str__(self):
        return self.name


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
        category_names = [category.get_value_display() for category in categories]
        category_desc = ", ".join(category_names)
        letters = ", ".join(letter.__str__() for letter in self.letters.all())
        return f"{category_desc} of {letters}"


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


class LetterEventDate(Field, models.Model):
    MIN_YEAR = 400
    MAX_YEAR = 800

    year_lower = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MIN_YEAR,
        help_text="The earliest possible year for the letter action",
    )

    year_upper = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MAX_YEAR,
        help_text="The latest possible year for the letter action",
    )

    year_exact = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        help_text="The exact year of the letter action (if known)",
    )

    letter_action = models.OneToOneField(
        to=LetterAction, on_delete=models.CASCADE, related_name="date"
    )

    def clean(self):
        if self.year_exact:
            self.year_lower = self.year_exact
            self.year_upper = self.year_exact

    def __str__(self):
        date = self.year_exact or f"{self.year_lower}–{self.year_upper}"
        return f"{self.letter_action} in {date}"


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
