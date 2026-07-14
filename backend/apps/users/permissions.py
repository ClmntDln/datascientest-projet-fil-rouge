"""Permissions personnalisées pour l'API utilisateurs."""
from rest_framework import permissions


class IsStaffMember(permissions.BasePermission):
    """Accès réservé aux comptes staff (is_staff)."""

    message = 'Accès réservé aux membres du staff.'

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )
