from graphene import ObjectType, Schema

from source.mutations.DeleteSourceMutation import DeleteSourceMutation
from source.queries import SourceQueries

from source.mutations.UpdateOrCreateSourceMutation import UpdateOrCreateSourceMutation


class Query(SourceQueries, ObjectType):
    pass


class Mutation(ObjectType):
    update_or_create_source = UpdateOrCreateSourceMutation.Field()
    delete_source = DeleteSourceMutation.Field()


schema = Schema(query=Query, mutation=Mutation)
