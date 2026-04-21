from django.contrib import admin

from .models import Article


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'updated_at')
    list_filter = ('created_at', 'author')
    search_fields = ('title', 'excerpt', 'content', 'author__email')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
