from django.urls import path

from .views import (
    AdminUserListView,
    AdminUserPatchView,
    LoginView,
    LogoutView,
    MeDeleteView,
    MeExportView,
    MeView,
    RefreshView,
    ResetPasswordConfirmView,
    ResetPasswordRequestView,
    SignUpView,
)

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="auth-signup"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("reset-password/request/", ResetPasswordRequestView.as_view(), name="auth-reset-request"),
    path("reset-password/confirm/", ResetPasswordConfirmView.as_view(), name="auth-reset-confirm"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("me/export/", MeExportView.as_view(), name="auth-me-export"),
    path("me/delete/", MeDeleteView.as_view(), name="auth-me-delete"),
    path("admin/users/", AdminUserListView.as_view(), name="auth-admin-users"),
    path("admin/users/<int:pk>/", AdminUserPatchView.as_view(), name="auth-admin-user"),
]
