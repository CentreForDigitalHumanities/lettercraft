from django.db import transaction
from django.conf import settings
from django.core.management.base import CommandError, BaseCommand
from faker import Faker
from source.models import Source

from case_study.models import CaseStudy
from event.models import Episode, Series
from person.models import (
    HistoricalPerson,
    AgentDescription,
    HistoricalPerson,
)
from letter.models import (
    LetterCategory,
    GiftDescription,
    LetterDescription,
    LetterDescriptionCategory,
)
import random

from django.contrib.contenttypes.models import ContentType

from .fixtures import (
    case_study_names,
    gift_names,
    epistolary_event_names,
    letter_category_names,
    source_names,
    group_names,
)
from .create_dev_dataset_utils import (
    get_unique_name,
    get_random_model_object,
    track_progress,
    get_random_model_objects,
)


class Command(BaseCommand):
    help = "Create a dataset for development purposes"

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true")

    def fake_field_value(self, fake):
        """
        Provides fake values for models inheriting
        the core.Field abstract class.
        """
        return {
            "certainty": random.choice([0, 1, 2]),
            "note": fake.text(),
        }

    def fake_date_value(self, fake):
        """
        Provides fake values for models inheriting
        the core.LettercraftDate abstract class.
        """
        exact_date = random.choice([True, False])
        if exact_date is True:
            return {
                "year_exact": random.randint(400, 800),
            }

        lower_bound = random.randint(400, 799)

        return {
            "year_lower": lower_bound,
            "year_upper": random.randint(lower_bound, 800),
        }

    def handle(self, *args, **options):
        if not settings.DEBUG and not options["force"]:
            raise CommandError(
                "Refusing to execute command unless DEBUG = True in settings.py"
            )

        try:
            from faker import Faker
        except ImportError:
            raise CommandError(
                "Faker is not installed. Please install by "
                "running `pip install faker`"
            )

        fake = Faker("en_GB")

        # Ensures that creation can be rolled back if an error occurs,
        with transaction.atomic():
            print("-" * 80)
            print("Creating Lettercraft development dataset")
            print("-" * 80)

            # Comment out the function calls below as needed.
            # Adjust the `total` parameter to create more or less data.
            # NB: the order of these function calls is important.
            self._create_sources(fake, options, total=50, model=Source)

            self._create_historical_persons(
                fake, options, total=50, model=HistoricalPerson
            )
            self._create_agent_descriptions(
                fake, options, total=100, model=AgentDescription
            )
            self._create_letter_categories(
                fake, options, total=10, model=LetterCategory
            )
            self._create_letter_descriptions(
                fake, options, total=200, model=LetterDescription
            )
            self._create_gift_descriptions(
                fake, options, total=50, model=GiftDescription
            )
            self._create_event_descriptions(fake, options, total=50, model=Episode)
            self._create_episodes(fake, options, total=20, model=Episode)
            self._create_case_studies(fake, options, total=10, model=CaseStudy)

            print("-" * 80)
            print("Development dataset created successfully.")

    @track_progress
    def _create_episodes(self, fake: Faker, options, total, model):
        unique_name = get_unique_name(epistolary_event_names, Series)
        events = get_random_model_objects(Episode, min_amount=1, max_amount=5)
        Series.objects.create(
            name=unique_name,
            description=fake.text(),
            events=events,
        )

    @track_progress
    def _create_case_studies(self, fake: Faker, options, total, model):
        unique_name = get_unique_name(case_study_names, CaseStudy)
        episodes = get_random_model_objects(Series, min_amount=1, max_amount=5)
        CaseStudy.objects.create(
            name=unique_name,
            episodes=episodes,
        )

    @track_progress
    def _create_event_descriptions(self, fake: Faker, options, total, model):
        unique_name = get_unique_name(epistolary_event_names, Episode)
        source = get_random_model_object(Source)

        event = Episode.objects.create(
            source=source, name=unique_name, description=fake.text()
        )

    @track_progress
    def _create_historical_person(self, fake: Faker, options, total, model):
        HistoricalPerson.objects.create(name=fake.name())

    @track_progress
    def _create_agent_descriptions(self, fake: Faker, options, total, model):
        source = get_random_model_object(Source)

        is_group = random.choice([True, False])

        if is_group is True:
            describes = get_random_model_objects(
                HistoricalPerson, min_amount=0, max_amount=5
            )
            name = random.choice(group_names)
        else:
            referent = get_random_model_object(HistoricalPerson, allow_null=True)
            if referent:
                name = referent.name
                describes = [referent]
            else:
                name = fake.name()
                describes = []

        AgentDescription.objects.create(
            name=name,
            source=source,
            is_group=is_group,
            describes=describes,
        )

    @track_progress
    def _create_letter_categories(self, fake: Faker, *args, **kwargs):
        unique_label = get_unique_name(
            list_of_names=letter_category_names,
            model=LetterCategory,
            name_field="label",
        )
        LetterCategory.objects.create(label=unique_label, description=fake.text())

    @track_progress
    def _create_letter_descriptions(self, fake: Faker, *args, **kwargs):
        source = get_random_model_object(Source)

        subject = ", ".join(fake.words(nb=3, unique=True))
        letter = LetterDescription.objects.create(
            source=source,
            name=f"Letter about {subject}",
        )

        if random.choice([True, False]):
            LetterDescriptionCategory.objects.create(
                letter=letter,
                category=get_random_model_object(LetterCategory),
                **self.fake_field_value(fake),
            )

    @track_progress
    def _create_gift_descriptions(self, fake, options, total, model):
        source = get_random_model_object(Source)
        unique_name = get_unique_name(gift_names, GiftDescription)

        GiftDescription.objects.create(
            source=source,
            name=unique_name,
            description=fake.text(),
        )

    @track_progress
    def _create_sources(self, fake, options, total, model):
        unique_name = get_unique_name(source_names, Source)
        Source.objects.create(name=unique_name, bibliographical_info=fake.text())
