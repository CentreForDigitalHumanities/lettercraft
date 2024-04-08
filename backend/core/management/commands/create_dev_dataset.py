from django.db import transaction
from django.conf import settings
from django.core.management.base import CommandError, BaseCommand
from faker import Faker
from source.models import Source

from case_study.models import CaseStudy, Episode
from event.models import (
    EventDescription,
    EventDescriptionDate,
    EventDescriptionAgent,
    EventDescriptionSpace,
    EventDescriptionGift,
    EventDescriptionLetter,
)
from person.models import (
    Person,
    PersonDateOfBirth,
    PersonDateOfDeath,
    Gender,
    StatusMarker,
    AgentDescription,
)
from letter.models import (
    Category,
    GiftDescription,
    LetterDescription,
    LetterMaterial,
    LetterCategory,
)
import random

from django.contrib.contenttypes.models import ContentType

from .fixtures import (
    case_study_names,
    gift_names,
    epistolary_event_names,
    letter_category_names,
    source_names,
    world_event_names,
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
            self._create_case_studies(fake, options, total=10, model=CaseStudy)
            self._create_episodes(fake, options, total=40, model=Episode)
            self._create_status_markers(fake, options, total=50, model=StatusMarker)
            self._create_people(fake, options, total=100, model=Person)
            self._create_letter_categories(fake, options, total=10, model=Category)
            self._create_letter_descriptions(
                fake, options, total=200, model=LetterDescription
            )
            self._create_gift_descriptions(
                fake, options, total=50, model=GiftDescription
            )
            self._create_event_descriptions(
                fake, options, total=200, model=EventDescription
            )
            self._create_sources(fake, options, total=50, model=Source)

            print("-" * 80)
            print("Development dataset created successfully.")

    @track_progress
    def _create_case_studies(self, fake: Faker, options, total, model):
        unique_name = get_unique_name(case_study_names, CaseStudy)
        CaseStudy.objects.create(name=unique_name)

    @track_progress
    def _create_episodes(self, fake, options, total, model):
        unique_name = get_unique_name(epistolary_event_names, Episode)

        event = Episode.objects.create(name=unique_name, note=fake.text())

        event.case_studies.set(
            get_random_model_objects(CaseStudy, min_amount=0, max_amount=3)
        )

    @track_progress
    def _create_status_markers(self, fake, options, total, model):
        StatusMarker.objects.create(name=fake.job(), description=fake.text())

    @track_progress
    def _create_people(self, fake: Faker, options, total, model):
        person = Person.objects.create(name=fake.name())

        if random.choice([True, False]):
            PersonDateOfBirth.objects.create(
                person=person,
                **self.fake_date_value(fake),
                **self.fake_field_value(fake),
            )

        if random.choice([True, False]):
            PersonDateOfDeath.objects.create(
                person=person,
                **self.fake_date_value(fake),
                **self.fake_field_value(fake),
            )

        person.clean()
        person.save()

    @track_progress
    def _create_letter_categories(self, fake: Faker, *args, **kwargs):
        unique_label = get_unique_name(
            list_of_names=letter_category_names, model=Category, name_field="label"
        )
        Category.objects.create(label=unique_label, description=fake.text())

    @track_progress
    def _create_letter_descriptions(self, fake: Faker, *args, **kwargs):
        subject = ", ".join(fake.words(nb=3, unique=True))
        letter = LetterDescription.objects.create(
            name=f"Letter about {subject}",
        )

        if random.choice([True, False]):
            LetterMaterial.objects.create(
                letter=letter,
                surface=random.choice(LetterMaterial.Surface.values),
                **self.fake_field_value(fake),
            )

        if random.choice([True, False]):
            LetterCategory.objects.create(
                letter=letter,
                category=get_random_model_object(Category),
                **self.fake_field_value(fake),
            )

        # senders = get_random_model_objects(Agent, min_amount=2, max_amount=5)
        # addressees = get_random_model_objects(Agent, min_amount=2, max_amount=5)

        # sender_object = LetterSenders.objects.create(
        #     letter=letter,
        #     **self.fake_field_value(fake),
        # )
        # sender_object.senders.set(senders)

        # addressees_object = LetterAddressees.objects.create(
        #     letter=letter,
        #     **self.fake_field_value(fake),
        # )
        # addressees_object.addressees.set(addressees)

    @track_progress
    def _create_event_descriptions(self, fake: Faker, *args, **kwargs):
        event = EventDescription.objects.create()
        event.letters.set(
            get_random_model_objects(LetterDescription, min_amount=1, max_amount=5)
        )

        event.gifts.set(
            get_random_model_objects(GiftDescription, min_amount=0, max_amount=5)
        )

        EventDescriptionDate.objects.create(
            letter_action=event,
            **self.fake_date_value(fake),
            **self.fake_field_value(fake),
        )

        for _ in range(random.randint(1, 5)):
            EventDescriptionAgent.objects.create(
                agent=get_random_model_object(AgentDescription),
                event=event,
                description=fake.text(),
                **self.fake_field_value(fake),
            )

    @track_progress
    def _create_gift_descriptions(self, fake, options, total, model):
        unique_name = get_unique_name(gift_names, GiftDescription)

        GiftDescription.objects.create(
            name=unique_name,
            description=fake.text(),
            source=get_random_model_object(Source),
        )

    @track_progress
    def _create_sources(self, fake, options, total, model):
        unique_name = get_unique_name(source_names, Source)
        Source.objects.create(name=unique_name, bibliographical_info=fake.text())
