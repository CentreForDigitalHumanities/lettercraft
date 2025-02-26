from graphene import ObjectType, Schema

from event.mutations.CreateEpisodeMutation import CreateEpisodeMutation
from event.mutations.DeleteEpisodeMutation import DeleteEpisodeMutation
from event.mutations.UpdateEpisodeOrderMutation import UpdateEpisodeOrderMutation
from event.queries import EventQueries
from letter.queries import LetterQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from space.queries import SpaceQueries
from user.queries import UserQueries

from source.mutations.UpdateSourceMutation import UpdateSourceMutation
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
from space.mutations.CreateSpaceMutation import CreateSpaceMutation
from space.mutations.DeleteSpaceMutation import DeleteSpaceMutation
from space.mutations.UpdateSpaceMutation import UpdateSpaceMutation
from person.mutations.CreatePersonReferenceMutation import CreatePersonReferenceMutation
from person.mutations.UpdatePersonReferenceMutation import UpdatePersonReferenceMutation
from person.mutations.DeletePersonReferenceMutation import DeletePersonReferenceMutation
from space.mutations.CreateSpaceMutation import CreateSpaceMutation

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
    update_source = UpdateSourceMutation.Field()
    update_episode = UpdateEpisodeMutation.Field()
    create_episode = CreateEpisodeMutation.Field()
    delete_episode = DeleteEpisodeMutation.Field()
    create_episode_entity_link = CreateEpisodeEntityLinkMutation.Field()
    update_episode_entity_link = UpdateEpisodeEntityLinkMutation.Field()
    delete_episode_entity_link = DeleteEpisodeEntityLinkMutation.Field()
    update_episode_order = UpdateEpisodeOrderMutation.Field()
    create_agent = CreateAgentMutation.Field()
    update_agent = UpdateAgentMutation.Field()
    delete_agent = DeleteAgentMutation.Field()
    create_letter = CreateLetterMutation.Field()
    update_letter = UpdateLetterMutation.Field()
    delete_letter = DeleteLetterMutation.Field()
    create_gift = CreateGiftMutation.Field()
    update_gift = UpdateGiftMutation.Field()
    delete_gift = DeleteGiftMutation.Field()
    create_space = CreateSpaceMutation.Field()
    update_space = UpdateSpaceMutation.Field()
    delete_space = DeleteSpaceMutation.Field()
    create_person_reference = CreatePersonReferenceMutation.Field()
    update_person_reference = UpdatePersonReferenceMutation.Field()
    delete_person_reference = DeletePersonReferenceMutation.Field()
    create_space = CreateSpaceMutation.Field()


schema = Schema(query=Query, mutation=Mutation)
