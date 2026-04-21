"""Vues CRUD pour les articles."""
from rest_framework import viewsets

from .models import Article
from .permissions import IsOwnerOrReadOnly
from .serializers import ArticleSerializer


class ArticleViewSet(viewsets.ModelViewSet):
    """Endpoints CRUD : lecture publique, écriture réservée aux auteurs actifs."""

    queryset = Article.objects.select_related('author').all()
    serializer_class = ArticleSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
