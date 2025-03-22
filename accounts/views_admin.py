from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import AdminUserSerializer
from .permissions import IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter

User = get_user_model()

class CustomPagination(PageNumberPagination):
    page_size = 10  # Show 10 users per page
    page_size_query_param = 'page_size'
    max_page_size = 50

class AdminUserListView(generics.ListAPIView):
    queryset = User.objects.filter(is_admin=False).order_by('date_joined')
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    pagination_class = CustomPagination
    filter_backends = [SearchFilter]
    search_fields = ['username', 'email']

class AdminUserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

class AdminUserUpdateView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]


class AdminUserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]

    

