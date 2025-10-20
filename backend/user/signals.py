from allauth.account.models import EmailAddress
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User, UserProfile


@receiver(post_save, sender=User)
def create_superuser_email(sender, instance, created, **kwargs):
    """
    Ensure newly created superuser accounts automatically have a verified email
    """
    if created and instance.is_superuser:
        try:
            EmailAddress.objects.get_or_create(
                user=instance, email=instance.email, verified=True, primary=True
            )
            print(f"Automatically verified email {instance.email} for {instance}")
        except Exception as e:
            print("Failed to automatically verify admin email", e, sep="\n")


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Ensure newly created superuser accounts automatically have a verified email
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)
