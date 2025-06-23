from django.db import models
from core.models import Named
from person.models import HistoricalPerson
from space.models import Structure
from user.models import User
from event.models import Episode
from source.models import Source

class CaseStudy(Named, models.Model):
    """
    A case study is an short piece of writing by a researcher on one or more
    episodes/sources.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"


    authors = models.ManyToManyField(
        to=User,
        blank=True,
        help_text='Author(s) of the case study',
    )

    date = models.DateField(
        auto_created=True,
        help_text='Date of writing',
    )

    content = models.TextField(
        blank=True,
        help_text='Article content (in HTML)',
    )

    sources = models.ManyToManyField(
        to=Source,
        blank=True,
        help_text='Source texts that are the focus of the case study',
    )

    episodes = models.ManyToManyField(
        to=Episode,
        blank=True,
        help_text='Epistolary episodes that are the focus of the case study'
    )

    key_persons = models.ManyToManyField(
        to=HistoricalPerson,
        blank=True,
        help_text="Key historical figures involved in this case study",
    )

    key_sites = models.ManyToManyField(
        to=Structure,
        blank=True,
        help_text="Key historical sites involved in this case study",
    )

    def __str__(self):
        return self.name
