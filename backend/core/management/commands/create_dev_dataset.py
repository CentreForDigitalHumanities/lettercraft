from typing import Type
from django.db import transaction
from django.conf import settings
from django.core.management.base import CommandError, BaseCommand
from faker import Faker
from source.models import Source, SourceWrittenDate

from event.models import (
    Episode,
    EpisodeAgent,
    EpisodeCategory,
    EpisodeGift,
    EpisodeLetter,
    EpisodeSpace,
)
from person.models import (
    HistoricalPerson,
    AgentDescription,
    HistoricalPerson,
)
from letter.models import (
    GiftCategory,
    LetterCategory,
    GiftDescription,
    LetterDescription,
)
import random
from django.db.models import Model

from space.models import SpaceDescription
from user.models import ContributorGroup, User

from .create_dev_dataset_utils import (
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

            self._create_contributor_groups(
                fake, options, total=5, model=ContributorGroup
            )

            self._create_users(fake, options, total=50, model=User)

            self._create_historical_persons(
                fake, options, total=50, model=HistoricalPerson
            )
            self._create_agent_descriptions(
                fake, options, total=800, model=AgentDescription
            )
            self._create_letter_categories(
                fake, options, total=10, model=LetterCategory
            )
            self._create_letter_descriptions(
                fake, options, total=200, model=LetterDescription
            )
            self._create_gift_categories(fake, options, total=10, model=GiftCategory)
            self._create_gift_descriptions(
                fake, options, total=150, model=GiftDescription
            )
            self._create_space_descriptions(
                fake, options, total=50, model=SpaceDescription
            )

            self._create_episode_categories(
                fake, options, total=25, model=EpisodeCategory
            )
            self._create_episodes(fake, options, total=500, model=Episode)

            self._create_admin(fake, options)

            print("-" * 80)
            print("Development dataset created successfully.")

    @track_progress
    def _create_episode_categories(self, fake: Faker, *args, **kwargs):
        fake.unique.clear()
        EpisodeCategory.objects.create(
            name=fake.unique.word(),
            description=fake.text(),
        )

    @track_progress
    def _create_episodes(self, fake: Faker, options, total, model):
        source = get_random_model_object(Source)

        episode = Episode.objects.create(
            source=source,
            name=fake.sentence(nb_words=6, variable_nb_words=True),
            summary=fake.text(),
            designators=fake.words(nb=3, unique=True),
        )

        episode_agents = get_random_model_objects(
            AgentDescription, min_amount=0, max_amount=20
        )
        for agent in episode_agents:
            EpisodeAgent.objects.create(
                episode=episode,
                agent=agent,
                designators=fake.words(nb=3, unique=True),
            )

        episode_gifts = get_random_model_objects(
            GiftDescription, min_amount=0, max_amount=20
        )
        for gift in episode_gifts:
            EpisodeGift.objects.create(
                episode=episode,
                gift=gift,
                designators=fake.words(nb=3, unique=True),
            )

        episode_letters = get_random_model_objects(
            LetterDescription, min_amount=0, max_amount=20
        )
        for letter in episode_letters:
            EpisodeLetter.objects.create(
                episode=episode,
                letter=letter,
                designators=fake.words(nb=3, unique=True),
            )

        episode_spaces = get_random_model_objects(
            SpaceDescription, min_amount=0, max_amount=20
        )
        for space in episode_spaces:
            EpisodeSpace.objects.create(
                episode=episode,
                space=space,
                designators=fake.words(nb=3, unique=True),
            )

        # Collect all contributors from related descriptions
        all_contributors = [
            contributor
            for description_list in [episode_agents, episode_gifts, episode_letters, episode_spaces]
            for description in description_list
            for contributor in description.contributors.all()
        ]

        # Remove duplicates and set contributors
        unique_contributors = list(set(all_contributors))
        episode.contributors.set(unique_contributors)

    @track_progress
    def _create_historical_persons(self, fake: Faker, *args, **kwargs):
        HistoricalPerson.objects.create(name=fake.name())

    @track_progress
    def _create_agent_descriptions(self, fake: Faker, *args, **kwargs):
        source = get_random_model_object(Source)

        is_group = random.choice([True, False])

        if is_group is True:
            describes = get_random_model_objects(
                HistoricalPerson, min_amount=0, max_amount=5
            )
            name = fake.word().capitalize() + "s"  # Simple pluralization
        else:
            referent = get_random_model_object(HistoricalPerson, allow_null=True)
            if referent:
                name = referent.name
                describes = [referent]
            else:
                name = fake.name()
                describes = []

        agent_description = AgentDescription.objects.create(
            name=name,
            source=source,
            is_group=is_group,
        )

        agent_description.describes.set(describes)

        contributors = get_random_model_objects(User, min_amount=3, max_amount=5)

        agent_description.contributors.set(contributors)

    @track_progress
    def _create_gift_categories(self, fake: Faker, *args, **kwargs):
        fake.unique.clear()
        GiftCategory.objects.create(label=fake.unique.word(), description=fake.text())

    @track_progress
    def _create_letter_categories(self, fake: Faker, *args, **kwargs):
        fake.unique.clear()
        LetterCategory.objects.create(label=fake.unique.word(), description=fake.text())

    @track_progress
    def _create_letter_descriptions(self, fake: Faker, *args, **kwargs):
        source = get_random_model_object(Source)

        categories = get_random_model_objects(
            LetterCategory, min_amount=0, max_amount=3
        )

        subject = ", ".join(fake.words(nb=3, unique=True))
        letter_description = LetterDescription.objects.create(
            source=source,
            name=f"Letter about {subject}",
        )
        letter_description.categories.set(categories)

        contributors = get_random_model_objects(User, min_amount=3, max_amount=5)

        letter_description.contributors.set(contributors)

    @track_progress
    def _create_gift_descriptions(self, fake: Faker, *args, **kwargs):
        source = get_random_model_object(Source)

        categories = get_random_model_objects(GiftCategory, min_amount=0, max_amount=3)

        gift_description = GiftDescription.objects.create(
            source=source,
            name=fake.sentence(nb_words=5, variable_nb_words=True),
            description=fake.text(),
        )
        gift_description.categories.set(categories)

        contributors = get_random_model_objects(User, min_amount=3, max_amount=5)

        gift_description.contributors.set(contributors)

    @track_progress
    def _create_space_descriptions(self, fake: Faker, *args, **kwargs):
        source = get_random_model_object(Source)

        space_description = SpaceDescription.objects.create(
            source=source,
            name=fake.sentence(nb_words=5, variable_nb_words=True),
            description=fake.text(),
        )

        contributors = get_random_model_objects(User, min_amount=3, max_amount=5)

        space_description.contributors.set(contributors)

    @track_progress
    def _create_sources(self, fake: Faker, *args, **kwargs):
        source = Source.objects.create(
            name=fake.sentence(nb_words=5, variable_nb_words=True),
            medieval_title=fake.sentence(),
            medieval_author=fake.name(),
            edition_title=fake.sentence(),
            edition_author=fake.name(),
            is_public=random.choice([True, False]),
        )

        if random.choice([True, False]):
            SourceWrittenDate.objects.create(
                source=source,
                **self.fake_date_value(fake),
            )

    @track_progress
    def _create_contributor_groups(self, fake: Faker, *args, **kwargs):
        sources = get_random_model_objects(Source, min_amount=0, max_amount=5)
        group = ContributorGroup.objects.create(
            name=fake.word().capitalize(),
        )
        group.sources.set(sources)

    @track_progress
    def _create_users(self, fake: Faker, *args, **kwargs):
        user = User.objects.create(
            username=fake.unique.user_name(),
            email=fake.email(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            is_active=True,
            is_staff=False,
        )

        # Assign the user to a random contributor group
        contributor_groups = get_random_model_objects(
            ContributorGroup, min_amount=0, max_amount=3
        )

        user.contributor_groups.set(contributor_groups)

    def _create_admin(self, fake: Faker, *args, **kwargs):
        """
        Creates an admin user with all permissions.
        """
        User.objects.create_superuser(
            username="admin",
            email="admin@lettercraft.nl",
            password="admin",
            first_name="Ad",
            last_name="Min",
            is_active=True,
        )
