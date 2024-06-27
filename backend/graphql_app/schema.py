from graphene import ObjectType, Schema

from event.queries import EventQueries
from person.queries import PersonQueries
from source.queries import SourceQueries
from source.mutations.UpdateOrCreateSourceMutation import UpdateOrCreateSourceMutation


class Query(SourceQueries, PersonQueries, EventQueries, ObjectType):
    pass


class Mutation(ObjectType):
    update_or_create_source = UpdateOrCreateSourceMutation.Field()


schema = Schema(query=Query, mutation=Mutation)
