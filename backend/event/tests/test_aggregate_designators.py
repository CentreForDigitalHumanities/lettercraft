import pytest

from event.models import Episode
from event.export_designators import count_designators

@pytest.fixture()
def episode_designators(episode: Episode):
    episode.designators = ['test', 'testing']
    episode.save()

@pytest.fixture()
def episode_2_designators(episode_2: Episode):
    episode_2.designators = ['test']
    episode_2.save()

def test_count_designators(episode, episode_2, episode_designators, episode_2_designators):
    episodes = Episode.objects.all()
    counts = count_designators(episodes)
    assert counts['test'] == 2
    assert counts['testing'] == 1


