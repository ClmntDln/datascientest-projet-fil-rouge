"""Vues CRUD pour les articles"""

from rest_framework import viewsets

from .models import Article
from .serializers import ArticleSerializer
from .permissions import IsAuthorOrReadOnly

class ArticleViewSet(viewsets.ModelViewSet):
    "Endpoints pour les articles : lecture publique, écriture restreinte pour auteurs"
    
    queryset = Article.objects.select_related('author').all()
    serializer_class = ArticleSerializer
    permission_classes = [IsAuthorOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
