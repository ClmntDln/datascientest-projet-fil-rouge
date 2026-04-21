"""Serializers pour le ressource Article."""
from rest_framework import serializers

from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    """Sérialisation d'un article avec nom d'auteur calculé."""

    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = (
            'id',
            'title',
            'excerpt',
            'content',
            'image',
            'author',
            'author_name',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'author', 'author_name', 'created_at', 'updated_at')

    def get_author_name(self, obj):
        return obj.author.full_name or obj.author.email
