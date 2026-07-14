"""Vues CRUD pour les articles."""
import os
import joblib
from rest_framework import viewsets, permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Article
from .permissions import IsOwnerOrReadOnly
from .serializers import ArticleSerializer


class ArticlePagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 24


class ArticleViewSet(viewsets.ModelViewSet):
    """Endpoints CRUD : lecture publique, écriture réservée aux auteurs actifs."""

    queryset = Article.objects.select_related('author').all()
    serializer_class = ArticleSerializer
    permission_classes = [IsOwnerOrReadOnly]
    pagination_class = ArticlePagination

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def classify(self, request):
        """Prédit la catégorie d'un article en fonction de son texte."""
        title = request.data.get('title', '')
        excerpt = request.data.get('excerpt', '')
        content = request.data.get('content', '')
        
        if not title and not excerpt and not content:
            return Response({'error': 'Veuillez fournir du texte (title, excerpt ou content).'}, status=400)
            
        full_text = f"{title} {excerpt} {content}".strip()
        
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        model_path = os.path.join(base_dir, 'ml', 'model.joblib')
        
        if not os.path.exists(model_path):
            # Algorithme par règles de secours si le modèle ML n'est pas encore entraîné
            text_lower = full_text.lower()
            if any(w in text_lower for w in ['react', 'python', 'code', 'git', 'docker', 'api', 'database', 'sql', 'typescript', 'websockets', 'node']):
                category = 'Tech'
            elif any(w in text_lower for w in ['design', 'ui', 'ux', 'figma', 'typography', 'color', 'layout', 'responsive', 'contrast', 'style']):
                category = 'Design'
            elif any(w in text_lower for w in ['seo', 'marketing', 'copywriting', 'campaign', 'email', 'ads', 'organic', 'conversion']):
                category = 'Marketing'
            else:
                category = 'Business'
            return Response({
                'category': category,
                'note': 'Modèle ML non encore entraîné. Utilisation du classificateur de secours par règles.'
            })
            
        try:
            pipeline = joblib.load(model_path)
            prediction = pipeline.predict([full_text])[0]
            probabilities = pipeline.predict_proba([full_text])[0]
            labels = sorted(list(pipeline.named_steps['clf'].classes_))
            confidence = float(max(probabilities))
            
            return Response({
                'category': prediction,
                'confidence': confidence,
                'probabilities': {label: float(prob) for label, prob in zip(labels, probabilities)}
            })
        except Exception as e:
            return Response({'error': f"Erreur lors de la prédiction : {str(e)}"}, status=500)
