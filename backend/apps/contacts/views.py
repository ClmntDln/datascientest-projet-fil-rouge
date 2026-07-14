from rest_framework import generics, permissions

from apps.users.permissions import IsStaffMember

from .models import Contact
from .serializers import ContactSerializer


class ContactListCreateView(generics.ListCreateAPIView):
    """POST public (formulaire) ; GET réservé au staff (liste des messages)."""

    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsStaffMember()]
