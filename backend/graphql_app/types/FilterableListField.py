from collections import OrderedDict
from functools import partial

from django.core.exceptions import ValidationError
from graphene import NonNull, String
from graphene.types.argument import to_arguments
from graphene.utils.str_converters import to_snake_case
from graphene_django import DjangoListField
from graphene_django.filter.fields import convert_enum
from graphene_django.filter.utils import (
    get_filtering_args_from_filterset,
    get_filterset_class,
)
from graphene_django.utils import maybe_queryset


class FilterableListField(DjangoListField):
    """
    A custom list field that supports filtering and searching using django-filters.

    The Graphene-Django docs require that you use Relay connections if you want
    to use filtering, which adds all kinds of overhead in the form of nodes and
    edges. This class allows you to use a simple list field.

    This class is taken from the DIAPP and has been expanded there with more
    features such as pagination and DRF-style searching with search_fields. We
    can look there if we need any of that functionality in the future.
    """

    def __init__(
        self,
        _type,
        fields=None,
        extra_filter_meta=None,
        filterset_class=None,
        *args,
        **kwargs,
    ):
        self._fields = fields
        self._provided_filterset_class = filterset_class
        self._filterset_class = None
        self._filtering_args = None
        self._extra_filter_meta = extra_filter_meta
        self._base_args = None

        kwargs.setdefault(
            "ordering", String(description="How the list should be ordered")
        )

        super().__init__(_type, *args, **kwargs)

    @property
    def args(self):
        return to_arguments(self._base_args or OrderedDict(), self.filtering_args)

    @args.setter
    def args(self, args):
        self._base_args = args

    @property
    def filterset_class(self):
        if not self._filterset_class:
            fields = (
                self._underlying_type._meta.filter_fields
                or self._fields
                or self._underlying_type._meta.fields.keys()
            )
            meta = {"model": self.model, "fields": fields}
            if self._extra_filter_meta:
                meta.update(self._extra_filter_meta)

            filterset_class = (
                self._provided_filterset_class
                or self._underlying_type._meta.filterset_class
            )
            self._filterset_class = get_filterset_class(filterset_class, **meta)

        return self._filterset_class

    @property
    def filtering_args(self):
        if not self._filtering_args:
            self._filtering_args = get_filtering_args_from_filterset(
                self.filterset_class, self._underlying_type
            )
        return self._filtering_args

    def get_queryset_resolver(self):
        return partial(
            self.resolve_queryset,
            filterset_class=self.filterset_class,
            filtering_args=self.filtering_args,
        )

    @classmethod
    def resolve_queryset(
        cls, django_object_type, queryset, info, args, filtering_args, filterset_class
    ):
        def filter_kwargs():
            kwargs = {}
            for k, v in args.items():
                if k in filtering_args:
                    if k == "order_by" and v is not None:
                        v = to_snake_case(v)
                    kwargs[k] = convert_enum(v)
            return kwargs

        # This line causes the query to be executed twice and does not pass kwargs to the get_queryset() method.
        # It was copied from the original implementation of DjangoListField, but we don't need it here.
        # qs = django_object_type.get_queryset(queryset, info)

        filterset = filterset_class(
            data=filter_kwargs(), queryset=queryset, request=info.context
        )
        if filterset.is_valid():
            return filterset.qs
        raise ValidationError(filterset.form.errors.as_json())

    @staticmethod
    def list_resolver(
        django_object_type,
        resolver,
        default_manager,
        queryset_resolver,
        root,
        info,
        **kwargs,
    ):
        queryset = maybe_queryset(resolver(root, info, **kwargs))
        if queryset is None:
            queryset = maybe_queryset(default_manager)
        queryset = queryset_resolver(django_object_type, queryset, info, kwargs)

        if ordering := kwargs.get("ordering"):
            ordering_fields = [
                to_snake_case(field.strip()) for field in ordering.split(",")
            ]
            queryset = queryset.order_by(*ordering_fields)
        else:
            queryset = queryset.order_by("id")

        return queryset

    def wrap_resolve(self, parent_resolver):
        resolver = super(DjangoListField, self).wrap_resolve(parent_resolver)
        _type = self.type
        if isinstance(_type, NonNull):
            _type = _type.of_type
        django_object_type = _type.of_type.of_type

        return partial(
            self.list_resolver,
            django_object_type,
            resolver,
            self.get_manager(),
            self.get_queryset_resolver(),
        )
