from django.db import models
from core.models import Named
from user.models import User
from source.models import Source

class CaseStudy(Named, models.Model):
    """
    A case study is a short piece of writing by a researcher on one or more
    sources.
    """

    class Meta:
        verbose_name = "case study"
        verbose_name_plural = "case studies"
        ordering = ['-date']


    authors = models.ManyToManyField(
        to=User,
        related_name='case_studies',
        blank=True,
        help_text='Author(s) of the case study',
    )

    date = models.DateField(
        help_text='Date of writing',
    )

    content = models.TextField(
        blank=True,
        help_text='Article content (in HTML)',
    )

    sources = models.ManyToManyField(
        to=Source,
        blank=True,
        related_name='case_studies',
        help_text='Source texts that are the focus of the case study',
    )

    def __str__(self):
        return self.name
