from django.urls import reverse

from user.models import User

def picture_url(user: User):
    return reverse("user picture", kwargs={"id": user.pk})
