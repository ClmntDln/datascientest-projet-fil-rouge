from django.urls import path

from .views import LoginView, MeView, RefreshView, ResetPasswordView, SignUpView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='auth-signup'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('refresh/', RefreshView.as_view(), name='auth-refresh'),
    path('reset-password/', ResetPasswordView.as_view(), name='auth-reset'),
    path('me/', MeView.as_view(), name='auth-me'),
]
