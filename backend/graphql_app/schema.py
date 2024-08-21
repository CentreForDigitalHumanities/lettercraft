from graphene import ObjectType, Schema

from event.queries import EventQueries
from letter.queries import LetterQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from space.queries import SpaceQueries
from user.queries import UserQueries
from source.mutations.UpdateOrCreateSourceMutation import UpdateOrCreateSourceMutation
from event.mutations.UpdateEpisodeMutation import UpdateEpisodeMutation
from person.mutations.UpdateAgentMutation import UpdateAgentMutation
from person.mutations.CreatePersonReferenceMutation import CreatePersonReferenceMutation
from person.mutations.UpdatePersonReferenceMutation import UpdatePersonReferenceMutation
from person.mutations.DeletePersonReferenceMutation import DeletePersonReferenceMutation


class Query(
    SourceQueries,
    PersonQueries,
    EventQueries,
    LetterQueries,
    SpaceQueries,
    UserQueries,
    ObjectType,
):
    pass


class Mutation(ObjectType):
    update_or_create_source = UpdateOrCreateSourceMutation.Field()
    update_episode = UpdateEpisodeMutation.Field()
    update_agent = UpdateAgentMutation.Field()
    create_person_reference = CreatePersonReferenceMutation.Field()
    update_person_reference = UpdatePersonReferenceMutation.Field()
    delete_person_reference = DeletePersonReferenceMutation.Field()


schema = Schema(query=Query, mutation=Mutation)
