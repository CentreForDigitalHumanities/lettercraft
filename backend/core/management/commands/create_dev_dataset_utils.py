import random
from functools import wraps
from typing import List, Optional, Type
from django.db.models import Model


def track_progress(func):
    """
    Decorator to track the progress of a creator function.
    Prints a progress bar to the console.

    Wrap this around a function that creates one model instance, and make sure that the function is called with a `total` and `model` parameter.

    This decorator makes sure that the inner function is run `total` amount of times.

    Example:

    ```
    @track_progress
    def create_books(self, fake, total, model)
        ...

    create_books(total=20, model=Book)

    ```

    """

    @wraps(func)
    def wrapper(*args, **kwargs):
        total = kwargs.get("total", 10)
        model = kwargs.get("model", None)
        if model:
            print(f"Creating {model._meta.verbose_name_plural}...")
        else:
            print(f"Creating objects...")
        for n in range(total + 1):
            progress(n, total)
            func(*args, **kwargs)

    return wrapper


def progress(iteration, total, width=80, start="\r", newline_on_complete=True):
    width = width - 2
    tally = f" {iteration}/{total}"
    width -= len(tally)
    filled_length = int(width * iteration // total)
    bar = "█" * filled_length + "-" * (width - filled_length)
    print(f"{start}|{bar}|{tally}", end="")
    # Print newline on complete
    if newline_on_complete and iteration == total:
        print()


def get_random_model_object(model: Type[Model], allow_null=False) -> Optional[Model]:
    """
    Returns a random object from the given model.

    If `allow_null` is True, `None` is returned half of the time.

    If there are no objects of the specified model, a `ValueError` is raised.
    """
    if allow_null and random.choice([True, False]):
        return None

    random_found = model.objects.order_by("?").first()
    if random_found:
        return random_found
    else:
        raise ValueError(
            f"No objects of type {model._meta.verbose_name_plural} found. Please create at least one."
        )


def get_random_model_objects(
    model: Type[Model], min_amount=0, max_amount=10, exact=False
) -> List[Model]:
    """
    Get a list of random model objects from the specified model.

    If `exact` is set to `True`, exactly `max_amount` objects will be returned.

    Else, a random number of objects between `min_amount` and `max_amount` will be returned.

    If there are not enough objects of the specified model exist in the database, a `ValueError` is raised.
    """
    all_random_objects = model.objects.order_by("?")
    if all_random_objects.count() < max_amount:
        raise ValueError(
            f"Not enough objects of type {model._meta.verbose_name_plural} for requested amount. Please create more."
        )

    if min_amount > max_amount:
        raise ValueError("min_amount cannot be greater than max_amount")

    if exact is True:
        return list(all_random_objects[:max_amount].all())
    return list(all_random_objects[: random.randint(min_amount, max_amount)].all())
