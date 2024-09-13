import graphene


class Entity(graphene.Enum):
    AGENT = "agent"
    GIFT = "gift"
    LETTER = "letter"
    SPACE = "space"


class EntityInterface(graphene.Interface):
    id = graphene.NonNull(graphene.ID)
    name = graphene.String()
    description = graphene.String()
