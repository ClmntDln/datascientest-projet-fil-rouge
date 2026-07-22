"""Permissions pour les articles"""

from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """Permission pour les auteurs : lecture publique, écriture restreinte"""
    
    message = "Vous n'avez pas les permissions nécessaires pour accéder à ce contenu."
    
    def has_permission(self, request, view):
        """Permission pour les requêtes non sécurisées"""
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.is_active)
    
    def has_object_permission(self, request, view, obj):
        """Permission pour les requêtes sécurisées"""
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author_id == request.user.id
    