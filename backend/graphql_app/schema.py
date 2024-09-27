from graphene import ObjectType, Schema

from event.mutations.CreateEpisodeMutation import CreateEpisodeMutation
from event.mutations.DeleteEpisodeMutation import DeleteEpisodeMutation
from event.queries import EventQueries
from letter.queries import LetterQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from space.queries import SpaceQueries
from user.queries import UserQueries

from source.mutations.UpdateOrCreateSourceMutation import UpdateOrCreateSourceMutation
from event.mutations.UpdateEpisodeMutation import UpdateEpisodeMutation
from event.mutations.CreateEpisodeEntityLinkMutation import (
    CreateEpisodeEntityLinkMutation,
)
from event.mutations.DeleteEpisodeEntityLinkMutation import (
    DeleteEpisodeEntityLinkMutation,
)
from event.mutations.UpdateEpisodeEntityLinkMutation import (
    UpdateEpisodeEntityLinkMutation,
)
from person.mutations.CreateAgentMutation import CreateAgentMutation
from person.mutations.UpdateAgentMutation import UpdateAgentMutation
from person.mutations.DeleteAgentMutation import DeleteAgentMutation
from letter.mutations.CreateLetterMutation import CreateLetterMutation
from letter.mutations.DeleteLetterMutation import DeleteLetterMutation
from letter.mutations.UpdateLetterMutation import UpdateLetterMutation
from letter.mutations.CreateGiftMutation import CreateGiftMutation
from letter.mutations.DeleteGiftMutation import DeleteGiftMutation
from letter.mutations.UpdateGiftMutation import UpdateGiftMutation
from space.mutations.CreateLocationMutation import CreateLocationMutation
from space.mutations.DeleteLocationMutation import DeleteLocationMutation
from space.mutations.UpdateLocationMutation import UpdateLocationMutation
from person.mutations.CreatePersonReferenceMutation import CreatePersonReferenceMutation
from person.mutations.UpdatePersonReferenceMutation import UpdatePersonReferenceMutation
from person.mutations.DeletePersonReferenceMutation import DeletePersonReferenceMutation


class Query(
    SourceQueries,
    PersonQueries,
    LetterQueries,
    SpaceQueries,
    EventQueries,
    UserQueries,
    ObjectType,
):
    pass


class Mutation(ObjectType):
    update_or_create_source = UpdateOrCreateSourceMutation.Field()
    update_episode = UpdateEpisodeMutation.Field()
    create_episode = CreateEpisodeMutation.Field()
    delete_episode = DeleteEpisodeMutation.Field()
    create_episode_entity_link = CreateEpisodeEntityLinkMutation.Field()
    update_episode_entity_link = UpdateEpisodeEntityLinkMutation.Field()
    delete_episode_entity_link = DeleteEpisodeEntityLinkMutation.Field()
    create_agent = CreateAgentMutation.Field()
    update_agent = UpdateAgentMutation.Field()
    delete_agent = DeleteAgentMutation.Field()
    create_letter = CreateLetterMutation.Field()
    update_letter = UpdateLetterMutation.Field()
    delete_letter = DeleteLetterMutation.Field()
    create_gift = CreateGiftMutation.Field()
    update_gift = UpdateGiftMutation.Field()
    delete_gift = DeleteGiftMutation.Field()
    create_location = CreateLocationMutation.Field()
    update_location = UpdateLocationMutation.Field()
    delete_location = DeleteLocationMutation.Field()
    create_person_reference = CreatePersonReferenceMutation.Field()
    update_person_reference = UpdatePersonReferenceMutation.Field()
    delete_person_reference = DeletePersonReferenceMutation.Field()


schema = Schema(query=Query, mutation=Mutation)
