from glob import glob
import warnings

from allauth.account.models import EmailAddress
from django.db.models.signals import pre_save, post_save, post_delete
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

@receiver(pre_save, sender=UserProfile)
def delete_old_image_file(sender, instance: UserProfile, **kwargs):
    if instance.pk is not None:
        picture_dir = instance.picture.storage.base_location
        saved_files = glob(f'profile_pictures/{instance.pk}.*', root_dir=picture_dir)

        if (not instance.picture) or (instance.picture and not instance.picture._committed):
            for path in saved_files:
                instance.picture.storage.delete(path)


@receiver(post_delete, sender=UserProfile)
def delete_image_on_object_delete(sender, instance: UserProfile, **kwargs):
    if instance.picture:
        if not instance.picture.storage.exists(instance.picture.path):
            warnings.warn(
                f'Picture from user {instance.user} could not be deleted, because the ' \
                'file does not exist.'
            )

        instance.picture.storage.delete(instance.picture.path)
