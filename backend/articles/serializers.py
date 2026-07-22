"""Serializers pour les articles"""

from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    """Serializer pour les articles"""
    
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = ["id", "title", "excerpt", "content", "image", "author", "author_name", "created_at", "updated_at"]
        read_only_fields = ["id", "author", "author_name", "created_at", "updated_at"]
    
    def get_author_name(self, obj):
        return obj.author.get_full_name() or obj.author.email

