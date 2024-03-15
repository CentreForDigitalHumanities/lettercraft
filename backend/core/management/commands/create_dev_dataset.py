from django.db import transaction
from django.conf import settings
from django.core.management.base import CommandError, BaseCommand
from faker import Faker
from source.models import Reference, Source

from case_study.models import CaseStudy
from event.models import (
    EpistolaryEvent,
    EpistolaryEventSelfTrigger,
    EpistolaryEventTrigger,
    LetterAction,
    LetterActionCategory,
    LetterEventDate,
    Role,
    WorldEvent,
    WorldEventSelfTrigger,
    WorldEventTrigger,
)
from person.models import (
    Agent,
    AgentDateOfBirth,
    AgentDateOfDeath,
    Gender,
    StatusMarker,
)
from letter.models import (
    Category,
    Gift,
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
            self._create_epistolary_events(
                fake, options, total=40, model=EpistolaryEvent
            )
            self._create_status_markers(fake, options, total=50, model=StatusMarker)
            self._create_agents(fake, options, total=100, model=Agent)
            self._create_letter_categories(fake, options, total=10, model=Category)
            self._create_letters(fake, options, total=200, model=Letter)
            self._create_gifts(fake, options, total=50, model=Gift)
            self._create_letter_actions(fake, options, total=200, model=LetterAction)
            self._create_world_events(fake, options, total=50, model=WorldEvent)
            self._create_world_event_triggers(
                fake, options, total=50, model=WorldEventTrigger
            )
            self._create_epistolary_event_triggers(
                fake, options, total=50, model=EpistolaryEventTrigger
            )
            self._create_world_event_self_triggers(
                fake, options, total=50, model=WorldEventSelfTrigger
            )
            self._create_epistolary_event_self_trigger(
                fake, options, total=50, model=EpistolaryEventSelfTrigger
            )
            self._create_sources(fake, options, total=50, model=Source)
            self._create_references(fake, options, total=250, model=Reference)

            print("-" * 80)
            print("Development dataset created successfully.")

    @track_progress
    def _create_case_studies(self, fake: Faker, options, total, model):
        unique_name = get_unique_name(case_study_names, CaseStudy)
        CaseStudy.objects.create(name=unique_name)

    @track_progress
    def _create_epistolary_events(self, fake, options, total, model):
        unique_name = get_unique_name(epistolary_event_names, EpistolaryEvent)

        event = EpistolaryEvent.objects.create(name=unique_name, note=fake.text())

        event.case_studies.set(
            get_random_model_objects(CaseStudy, min_amount=0, max_amount=3)
        )

    @track_progress
    def _create_status_markers(self, fake, options, total, model):
        StatusMarker.objects.create(name=fake.job(), description=fake.text())

    @track_progress
    def _create_agents(self, fake: Faker, options, total, model):
        is_group = random.choice([True, False])

        if is_group is True:
            gender_options = [
                gender for gender in Gender.values if gender != Gender.MIXED
            ]
            agent_names = random.sample(group_names, k=random.randint(0, 3))
        else:
            gender_options = Gender.values
            agent_names = [fake.name() for _ in range(random.randint(0, 3))]

        agent = Agent.objects.create(
            is_group=is_group, gender=random.choice(gender_options)
        )

        for name in agent_names:
            agent.names.create(
                value=name,
                **self.fake_field_value(fake),
            )

        if is_group is False:
            if random.choice([True, False]):
                AgentDateOfBirth.objects.create(
                    agent=agent,
                    **self.fake_date_value(fake),
                    **self.fake_field_value(fake),
                )

            if random.choice([True, False]):
                AgentDateOfDeath.objects.create(
                    agent=agent,
                    **self.fake_date_value(fake),
                    **self.fake_field_value(fake),
                )

        for _ in range(random.randint(0, 2)):
            agent.social_statuses.create(
                status_marker=get_random_model_object(StatusMarker),
                **self.fake_date_value(fake),
                **self.fake_field_value(fake),
            )

        agent.clean()
        agent.save()

    @track_progress
    def _create_letter_categories(self, fake: Faker, *args, **kwargs):
        unique_label = get_unique_name(
            list_of_names=letter_category_names, model=Category, name_field="label"
        )
        Category.objects.create(label=unique_label, description=fake.text())

    @track_progress
    def _create_letters(self, fake: Faker, *args, **kwargs):
        senders = get_random_model_objects(Agent, min_amount=2, max_amount=5)
        addressees = get_random_model_objects(Agent, min_amount=2, max_amount=5)

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
                category=get_random_model_object(Category),
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
        action.letters.set(get_random_model_objects(Letter, min_amount=1, max_amount=5))

        action.gifts.set(get_random_model_objects(Gift, min_amount=0, max_amount=5))

        action.epistolary_events.set(
            get_random_model_objects(EpistolaryEvent, min_amount=0, max_amount=5)
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
                value=random_categories[i][0],
                **self.fake_field_value(fake),
            )

        for _ in range(random.randint(1, 5)):
            Role.objects.create(
                agent=get_random_model_object(Agent),
                letter_action=action,
                present=random.choice([True, False]),
                role=random.choice(Role.RoleOptions.choices)[0],
                description=fake.text(),
                **self.fake_field_value(fake),
            )

    @track_progress
    def _create_gifts(self, fake, options, total, model):
        unique_name = get_unique_name(gift_names, Gift)

        gifter = get_random_model_object(Agent, allow_null=True)

        Gift.objects.create(
            name=unique_name,
            material=random.choice(Gift.Material.choices)[0],
            gifted_by=gifter,
            description=fake.text(),
        )

    @track_progress
    def _create_world_events(self, fake, options, total, model):
        unique_name = get_unique_name(world_event_names, WorldEvent)
        WorldEvent.objects.create(
            name=unique_name, note=fake.text(), **self.fake_date_value(fake)
        )

    @track_progress
    def _create_world_event_triggers(self, fake, options, total, model):
        WorldEventTrigger.objects.create(
            world_event=get_random_model_object(WorldEvent),
            epistolary_event=get_random_model_object(EpistolaryEvent),
            **self.fake_field_value(fake),
        )

    @track_progress
    def _create_epistolary_event_triggers(self, fake, options, total, model):
        EpistolaryEventTrigger.objects.create(
            epistolary_event=get_random_model_object(EpistolaryEvent),
            world_event=get_random_model_object(WorldEvent),
            **self.fake_field_value(fake),
        )

    @track_progress
    def _create_world_event_self_triggers(self, fake, options, total, model):
        [triggering, triggered] = get_random_model_objects(
            WorldEvent, max_amount=2, exact=True
        )
        WorldEventSelfTrigger.objects.create(
            triggered_world_event=triggering,
            triggering_world_event=triggered,
            **self.fake_field_value(fake),
        )

    @track_progress
    def _create_epistolary_event_self_trigger(self, fake, options, total, model):
        [triggering, triggered] = get_random_model_objects(
            EpistolaryEvent, max_amount=2, exact=True
        )
        EpistolaryEventSelfTrigger.objects.create(
            triggering_epistolary_event=triggering,
            triggered_epistolary_event=triggered,
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

        random_objects = random_content_type.model_class().objects.all()

        if not random_objects.exists():
            return

        random_object_id = random_objects.order_by("?").first().id

        random_source = Source.objects.order_by("?").first()

        Reference.objects.create(
            content_type=random_content_type,
            object_id=random_object_id,
            source=random_source,
            location=f"chapter {random.randint(1, 10)}, page {random.randint(1, 100)}",
            terminology=fake.words(nb=3, unique=True),
            mention=random.choice(["direct", "implied"]),
        )
