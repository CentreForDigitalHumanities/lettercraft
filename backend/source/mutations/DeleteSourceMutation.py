from graphene import Mutation, ID, Boolean, ResolveInfo, String
from source.models import Source


class DeleteSourceMutation(Mutation):
    ok = Boolean(required=True)
    error = String()

    class Arguments:
        id = ID(required=True)

    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, id: str):
        try:
            source = Source.objects.get(pk=id)
        except Source.DoesNotExist:
            return cls(ok=False, error="Source not found.") # type: ignore

        source.delete()

        return cls(ok=True) # type: ignore
