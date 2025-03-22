from django.urls import path
from .views_admin import AdminUserListView, AdminUserCreateView, AdminUserUpdateView, AdminUserDeleteView

urlpatterns = [
    path('users/', AdminUserListView.as_view(), name='admin-user-list'),
    path('users/create/', AdminUserCreateView.as_view(), name='admin-user-create'),
    path('users/<int:pk>/', AdminUserUpdateView.as_view(), name='admin-user-update'),
    path('users/<int:pk>/delete/', AdminUserDeleteView.as_view(), name='admin-user-delete'),
]
