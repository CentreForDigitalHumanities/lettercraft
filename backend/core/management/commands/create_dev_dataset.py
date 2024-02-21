from typing import List
from django.db import transaction
from django.conf import settings
from django.db.models import Model
from django.core.management.base import CommandError, BaseCommand
from functools import wraps
from faker import Faker
from source.models import Reference, Source

from case_study.models import CaseStudy
from event.models import (
    EpistolaryEvent,
    LetterAction,
    LetterActionCategory,
    LetterEventDate,
    Role,
)
from person.models import (
    Person,
    Office,
    Occupation,
    PersonDateOfBirth,
    PersonDateOfDeath,
)
from letter.models import (
    Category,
    Letter,
    LetterAddressees,
    LetterCategory,
    LetterMaterial,
    LetterSenders,
)
import random

from django.contrib.contenttypes.models import ContentType

from .fixtures import (
    case_study_names,
    gift_names,
    epistolary_event_names,
    letter_category_names,
    source_names,
)


# Track progress decorator
def track_progress(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        total = kwargs.get("total", 15)
        model = kwargs.get("model", None)
        if model:
            print(f"Creating {model._meta.verbose_name_plural}...")
        else:
            print(f"Creating objects...")
        for n in range(1, total + 1):
            progress(n, total)
            func(*args, **kwargs)

    return wrapper


def get_unique_name(
    list_of_names: List[str], model: Model, name_field="name", retries=1000
):
    for _ in range(retries):
        unique_name = random.choice(list_of_names)

        filter = {f"{name_field}": unique_name}
        if not model.objects.filter(**filter).exists():
            return unique_name
    raise ValueError("Could not find a unique name")


class Command(BaseCommand):
    help = "Create a dataset for development purposes"

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true")

    def info(self, *args, **kwargs):
        self.stdout.write(*args, **kwargs)

    def error(self, *args, **kwargs):
        self.stderr.write(*args, **kwargs)

    def fake_field_value(self, fake):
        """
        Provides fake values for the core.Field abstract class.
        """
        return {
            "certainty": random.choice([0, 1, 2]),
            "note": fake.text(),
        }

    def fake_date_value(self, fake):
        """
        Provides fake values for the core.LettercraftDate abstract class.
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

        with transaction.atomic():
            # Create Letter Actions
            # Create Sources

            self.info("-" * 80)
            self.info("Creating Lettercraft development dataset")
            self.info("-" * 80)

            # self._create_case_studies(fake, options, total=10, model=CaseStudy)
            # self._create_epistolary_events(
            #     fake, options, total=40, model=EpistolaryEvent
            # )
            # self._create_offices(fake, options, total=50, model=Office)
            # self._create_persons(fake, options, total=100, model=Person)
            # self._create_letter_categories(fake, options, total=10, model=Category)
            # self._create_letters(fake, options, total=200, model=Letter)
            # self._create_letter_actions(fake, options, total=200, model=LetterAction)
            # self._create_sources(fake, options, total=50, model=Source)
            self._create_references(fake, options, total=250, model=Reference)

            self.info("-" * 80)
            self.info("Development dataset created successfully.")

    @track_progress
    def _create_case_studies(self, fake: Faker, options, total, model):
        unique_name = get_unique_name(case_study_names, CaseStudy)
        CaseStudy.objects.create(name=unique_name)

    @track_progress
    def _create_epistolary_events(self, fake, options, total, model):
        unique_name = get_unique_name(epistolary_event_names, EpistolaryEvent)

        event = EpistolaryEvent.objects.create(name=unique_name, note=fake.text())

        number_of_case_studies = random.randint(0, 3)
        if number_of_case_studies > 0:
            case_studies = CaseStudy.objects.order_by("?")[:number_of_case_studies]
            event.case_studies.set(case_studies)

    @track_progress
    def _create_offices(self, fake, options, total, model):
        Office.objects.create(name=fake.job(), description=fake.text())

    @track_progress
    def _create_persons(self, fake: Faker, options, total, model):
        person = Person.objects.create(gender=random.choice(Person.Gender.values))
        for _ in range(random.randint(0, 3)):
            person.names.create(value=fake.name())
        person.save()

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

        for _ in range(random.randint(0, 2)):
            person.occupations.create(
                office=Office.objects.order_by("?").first(),
                **self.fake_date_value(fake),
                **self.fake_field_value(fake),
            )

    @track_progress
    def _create_letter_categories(self, fake: Faker, *args, **kwargs):
        unique_label = get_unique_name(
            list_of_names=letter_category_names, model=Category, name_field="label"
        )
        Category.objects.create(label=unique_label, description=fake.text())

    @track_progress
    def _create_letters(self, fake: Faker, *args, **kwargs):
        senders = Person.objects.order_by("?")[: random.randint(2, 5)]
        addressees = Person.objects.order_by("?")[: random.randint(2, 5)]

        subject = ", ".join(fake.words(nb=3, unique=True))
        letter = Letter.objects.create(
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
                category=Category.objects.order_by("?").first(),
                **self.fake_field_value(fake),
            )

        sender_object = LetterSenders.objects.create(
            letter=letter,
            **self.fake_field_value(fake),
        )
        sender_object.senders.set(senders)

        addressees_object = LetterAddressees.objects.create(
            letter=letter,
            **self.fake_field_value(fake),
        )
        addressees_object.addressees.set(addressees)

    @track_progress
    def _create_letter_actions(self, fake: Faker, *args, **kwargs):
        action = LetterAction.objects.create()
        action.letters.set(Letter.objects.order_by("?")[: random.randint(1, 5)])

        action.epistolary_events.set(
            EpistolaryEvent.objects.order_by("?")[: random.randint(0, 5)]
        )

        LetterEventDate.objects.create(
            letter_action=action,
            **self.fake_date_value(fake),
            **self.fake_field_value(fake),
        )

        no_of_categories = random.randint(1, 5)
        random_categories = random.sample(
            LetterActionCategory.CategoryOptions.choices, no_of_categories
        )
        for i in range(no_of_categories):
            LetterActionCategory.objects.create(
                letter_action=action,
                value=random_categories[i],
                **self.fake_field_value(fake),
            )

        for _ in range(random.randint(1, 5)):
            Role.objects.create(
                person=Person.objects.order_by("?").first(),
                letter_action=action,
                present=random.choice([True, False]),
                role=random.choice(Role.RoleOptions.choices),
                description=fake.text(),
                **self.fake_field_value(fake),
            )

    @track_progress
    def _create_sources(self, fake, options, total, model):
        unique_name = get_unique_name(source_names, Source)
        Source.objects.create(name=unique_name, bibliographical_info=fake.text())

    @track_progress
    def _create_references(self, fake, options, total, model):
        random_content_type = (
            ContentType.objects.exclude(
                app_label__in=["admin", "auth", "contenttypes", "sessions", "source"]
            )
            .order_by("?")
            .first()
        )

        random_object_id = (
            random_content_type.model_class().objects.order_by("?").first().id
        )

        random_source = Source.objects.order_by("?").first()

        Reference.objects.create(
            content_type=random_content_type,
            object_id=random_object_id,
            source=random_source,
            location=f"chapter {random.randint(1, 10)}, page {random.randint(1, 100)}",
            terminology=[fake.words(nb=3, unique=True)],
            mention=random.choice(["direct", "implied"]),
        )


def progress(iteration, total, width=80, start="\r", newline_on_complete=True):
    width = width - 2
    tally = f" {iteration}/{total}"
    width -= len(tally)
    filled_length = int(width * iteration // total)
    bar = "█" * filled_length + "-" * (width - filled_length)
    print(f"{start}|{bar}|{tally}", end="")
    # Print New Line on Complete
    if newline_on_complete and iteration == total:
        print()
