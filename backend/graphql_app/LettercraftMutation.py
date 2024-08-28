from typing import Type
from dataclasses import dataclass
from graphene import InputObjectType, Mutation, ResolveInfo
from django.db.models import Model
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from graphene_django.registry import get_global_registry


@dataclass
class RetrievedObject:
    object: Model
    created: bool


class LettercraftMutation(Mutation):
    """
    An extension of Graphene's base Mutation class.
    """

    django_model: Type[Model] | None = None

    @classmethod
    def get_object(cls, info: ResolveInfo, mutation_input: InputObjectType) -> Model:
        """
        Retrieves a Django model instance by id.

        Any mutation making use of this method should have a class field 'django_model'
        defined referring to the class of the object that is being mutated.

        Args:
            - mutation_input (InputObjectType): The mutation input.
            - info (ResolveInfo): An object containing the request and user information.

        Exceptions:
            - ImproperlyConfigured is raised in two cases:
                1. when the mutation class implementing LettercraftMutation does not have
                    the required class field 'django_model' defined;
                2. when the corresponding Graphene type cannot be found. This exception
                    should not be caught.
            - ObjectDoesNotExist is raised when an ID is provided but the corresponding
                object is not found or inaccessible to the user making the request.
        """

        model = cls._model()

        id = getattr(mutation_input, "id")

        # The registry is a global object that holds all the models and types.
        # It is used to get the corresponding Graphene type for a Django model.
        registry = get_global_registry()
        graphene_type = registry.get_type_for_model(model)

        if graphene_type is None:
            raise ImproperlyConfigured("Graphene type not found for model.")

        try:
            retrieved = graphene_type.get_queryset(model.objects, info).get(pk=id)
        except model.DoesNotExist:
            raise ObjectDoesNotExist("Object not found.")

        return retrieved

    @classmethod
    def create_object(cls) -> Model:
        """
        Create a new Django model instance.

        The instance will be empty, i.e. will not have any (obligatory) fields set.
        """

        model = cls._model()
        return model()

    @classmethod
    def get_or_create_object(
        cls, info: ResolveInfo, mutation_input: InputObjectType
    ) -> RetrievedObject:
        """
        Defers to `get_object()` or `create_object()` based on the input.

        If the input specifies an `id`, this will retrieve the matching object. Otherwise,
        this will construct a new instance.
        """

        id = getattr(mutation_input, "id", None)

        if id:
            return RetrievedObject(cls.get_object(info, mutation_input), True)
        else:
            return RetrievedObject(cls.create_object(), False)

    @staticmethod
    def mutate_object(
        input: InputObjectType,
        object_instance: Model,
        resolve_info: ResolveInfo,
        excluded_fields: list[str] = [],
    ) -> None:
        """
        Updates both simple and related fields in a GraphQL mutation.

        Simple fields are simply set on the mutated object.

        For related fields, the corresponding Django models and Graphene types are retrieved,
        and type.get_queryset() is called to ensure the user has access to those particular models.

        Args:
            - input (dict): A dictionary containing the updated values for the related fields.
            object_instance (Model): The Django model instance to be updated.
            - resolve_info (ResolveInfo): An object containing the request and user information.
            excluded_fields (List[str]): A list of fields to be excluded from the update.

        Exceptions:
            - ObjectDoesNotExist is raised when an ID of a ForeignKey field is provided but the corresponding object is not found or inaccessible to the user making the request. This exception exposes the name of the field.
        """

        # The Graphene registry maps Django models to Graphene types.
        registry = get_global_registry()

        simple_fields = []
        one_to_many_fields = []
        many_to_many_fields = []

        for key, value in input.items():
            # Skip excluded fields
            if key in excluded_fields:
                continue

            field = object_instance._meta.get_field(key)

            # Triage
            if field.many_to_many is True:
                many_to_many_fields.append(key)
            elif field.many_to_one is True:
                one_to_many_fields.append(key)
            else:
                simple_fields.append(key)

        # Update simple fields
        for key in simple_fields:
            try:
                value = getattr(input, key)
                setattr(object_instance, key, value)
            except AttributeError:
                pass

        # Update one-to-many fields.
        # Only selects existing objects on the 'many' side
        # of the relationship.
        for key in one_to_many_fields:
            try:
                value = getattr(input, key)
            except AttributeError:
                continue

            if value is None or value == "":
                setattr(object_instance, key, None)
                continue

            field = object_instance._meta.get_field(key)
            django_model = field.related_model  # type: Model | None

            if django_model is None:
                continue

            graphene_type = registry.get_type_for_model(django_model)

            try:
                accessible_object = graphene_type.get_queryset(
                    django_model.objects, resolve_info
                ).get(id=value)
            except django_model.DoesNotExist:
                raise ObjectDoesNotExist(key)

            setattr(object_instance, key, accessible_object)

        # Saving the object instance so we can use it for many-to-many fields.
        object_instance.save()

        # Update many-to-many fields
        for key in many_to_many_fields:
            try:
                value = getattr(input, key)
            except AttributeError:
                continue

            if value is None:
                getattr(object_instance, key).set([])
                continue

            field = object_instance._meta.get_field(key)
            django_model = field.related_model
            graphene_type = registry.get_type_for_model(django_model)

            accessible_objects = graphene_type.get_queryset(
                django_model.objects, resolve_info
            )

            new_ids = [
                item["id"]
                for item in accessible_objects.filter(id__in=value).values("id")
            ]

            getattr(object_instance, key).set(new_ids)

    # All subclasses of Mutation must implement the mutate method.
    @classmethod
    def mutate(cls, root: None, info: ResolveInfo, *args, **kwargs):
        cls.mutate(root, info, *args, **kwargs)

    @classmethod
    def _model(cls):
        """
        Returns the Django model for the mutation class

        Raises:
            ImproperlyConfigured:
                The mutation class implementing LettercraftMutation does not have
                    the required class field 'django_model' defined.
        """
        if cls.django_model is None:
            raise ImproperlyConfigured(
                "Mutation class must have a class field 'django_model' defined."
            )
        return cls.django_model
