from graphene import ObjectType, Schema

from event.queries import EventQueries
from letter.queries import LetterQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from space.queries import SpaceQueries
from source.mutations.UpdateOrCreateSourceMutation import UpdateOrCreateSourceMutation
from event.mutations.UpdateCreateEpisodeMutation import UpdateCreateEpisodeMutation


class Query(SourceQueries, PersonQueries, EventQueries, LetterQueries, SpaceQueries, ObjectType):
    pass


class Mutation(ObjectType):
    update_or_create_source = UpdateOrCreateSourceMutation.Field()
    update_or_create_episode = UpdateCreateEpisodeMutation.Field()


schema = Schema(query=Query, mutation=Mutation)
