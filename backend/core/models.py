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

class LettercraftDate(models.Model):
    MIN_YEAR = 400
    MAX_YEAR = 800

    year_lower = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MIN_YEAR,
        help_text="The earliest possible year for this value",
    )

    year_upper = models.IntegerField(
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        default=MAX_YEAR,
        help_text="The latest possible year for this value",
    )

    year_exact = models.IntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(MIN_YEAR),
            MaxValueValidator(MAX_YEAR),
        ],
        help_text="The exact year of the value (if known). This will override the values in the lower and upper bounds fields.",
    )

    @property
    def display_date(self):
        if self.year_exact:
            return str(self.year_exact)
        return f"c. {self.year_lower}–{self.year_upper}"

    class Meta:
        abstract = True

    def clean(self):
        if self.year_exact:
            self.year_lower = self.year_exact
            self.year_upper = self.year_exact