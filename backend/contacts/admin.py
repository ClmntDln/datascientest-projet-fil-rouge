from django.contrib import admin

from .models import Contact


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ("subject", "name", "email", "consent_given", "created_at")
    list_filter = ("created_at", "consent_given")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "consent_given", "consent_at")
    ordering = ("-created_at",)
