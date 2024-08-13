from graphene import ObjectType, Schema

from event.queries import EventQueries
from letter.queries import LetterQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from space.queries import SpaceQueries
from user.queries import UserQueries
from source.mutations.UpdateOrCreateSourceMutation import UpdateOrCreateSourceMutation


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


schema = Schema(query=Query, mutation=Mutation)
