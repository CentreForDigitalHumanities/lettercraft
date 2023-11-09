from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Field(models.Model):
    certainty = models.IntegerField(
        choices=[
            (0, 'uncertain'),
            (1, 'somewhat certain'),
            (2, 'certain'),
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
        return f'letter #{self.id}'


class LetterMaterial(Field, models.Model):
    surface = models.CharField(
        choices=[
            ('parchment', 'parchment'),
            ('papyrus', 'papyrus'),
            ('other', 'other'),
            ('unknown', 'unknown'),
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
            return f'material of {self.letter}'
        else:
            return f'material #{self.id}'


class Person(models.Model):
    def __str__(self):
        if self.names.count():
            return self.names.first().value
        else:
            return f'Unknown person #{self.id}'


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
        related_name='names',
        unique=True,
    )

    def __str__(self):
        return self.value


class EpistolaryEvent(models.Model):
    letters = models.ManyToManyField(
        to=Letter,
        related_name='events',
        help_text='letters involved in this event',
    )

    actors = models.ManyToManyField(
        to=Person,
        through='Role',
        related_name='events',
    )

    def __str__(self):
        categories = self.categories.all()
        category_names = [
            category.get_value_display()
            for category in categories
        ]
        category_desc = ', '.join(category_names)
        letters = ', '.join(letter.__str__() for letter in self.letters.all())
        return f'{category_desc} of {letters}'



class EpistolaryEventCategory(Field, models.Model):
    value = models.CharField(
        choices=[
            ('write', 'writing'),
            ('transport', 'transporting'),
            ('deliver', 'delivering'),
            ('read', 'reading'),
            ('sign', 'signing'),
            ('eat', 'eating'),
        ],
        null=False,
        blank=False,
        help_text='The type of event'
    )

    event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        related_name='categories',
        null=False,
        blank=False,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                'value',
                'event',
                name='unique_categories_for_event'
            )
        ]
        verbose_name_plural = 'epistolary event categories'

    def __str__(self):
        return f'{self.event}: {self.get_value_display()}'

class EpistolaryEventDate(Field, models.Model):
    MIN_YEAR = 400
    MAX_YEAR = 800

    year_lower = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MIN_YEAR,
        help_text='The earliest possible year for the event'
    )

    year_upper = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MAX_YEAR,
        help_text='The latest possible year for the event',
    )

    year_exact = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        help_text='The exact year of the event (if known)'
    )

    event = models.OneToOneField(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        related_name='date'
    )

    def clean(self):
        if self.year_exact:
            self.year_lower = self.year_exact
            self.year_upper = self.year_exact


class Role(Field, models.Model):
    person = models.ForeignKey(
        to=Person,
        on_delete=models.CASCADE,
        null=False,
    )
    event = models.ForeignKey(
        to=EpistolaryEvent,
        on_delete=models.CASCADE,
        null=False,
    )
    present = models.BooleanField(
        null=False,
        default=True,
        help_text='Whether this person was physically present',
    )
    role = models.CharField(
        choices=[
            ('author', 'Author'),
            ('scribe', 'Scribe'),
            ('reader', 'Reader'),
            ('witness', 'Witness'),
            ('messenger', 'Messenger'),
            ('recipient', 'Recipient'),
            ('intended_recipient', 'Intended recipient'),
            ('audience', 'Audience'),
            ('intended_audience', 'Intended audience'),
            ('other', 'Other'),
        ],
        null=False,
        blank=False,
        help_text='Role of this person in the event'
    )
    description = models.TextField(
        null=False,
        blank=True,
        help_text='Longer description of this person\'s involvement',
    )

    def __str__(self):
        return f'role of {self.person} in {self.event}'
