from django.urls import path
from .views import UserProfileUpdateView, UploadProfileImageView

urlpatterns = [
    path('profile/', UserProfileUpdateView.as_view(), name='profile-update'),
    path("upload-profile-image/", UploadProfileImageView.as_view(), name="upload-profile-image"),
]