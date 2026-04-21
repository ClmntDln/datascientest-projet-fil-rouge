"""Permissions personnalisées pour les articles."""
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Lecture autorisée pour tous. Écriture réservée à l'auteur du contenu
    et uniquement si son compte est validé (is_active=True).
    """

    message = "Vous n'êtes pas autorisé à modifier cet article."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_active)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author_id == request.user.id
