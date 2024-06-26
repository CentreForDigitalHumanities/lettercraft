from django.urls import include, path, re_path
from .views import DeleteUser, redirect_confirm, KeyInfoView
from dj_rest_auth.registration.views import VerifyEmailView

from .views import KeyInfoView, redirect_confirm, redirect_reset

urlpatterns = [
    # registration
    re_path(
        r"registration/account-confirm-email/(?P<key>.+)/",
        redirect_confirm,
        name="account_confirm_email",
    ),
    path("registration/key-info/", KeyInfoView.as_view(), name="key-info"),
    path(
        "account-confirm-email/",
        VerifyEmailView.as_view(),
        name="account_email_verification_sent",
    ),
    # password reset
    path(
        "password-reset/<uidb64>/<token>/",
        redirect_reset,
        name="password_reset_confirm",
    ),
    # delete user
    path(
        "delete/",
        DeleteUser.as_view(),
        name="delete user"
    ),
    # generic routes (login, logout, pw reset etc.)
    path("", include("dj_rest_auth.urls")),
    path("registration/", include("dj_rest_auth.registration.urls")),
]
