from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from .serializers import UserProfileUpdateSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import cloudinary.uploader
from .serializers import UserProfileUpdateSerializer


User = get_user_model()

class UserProfileUpdateView(generics.RetrieveUpdateAPIView):
    print("inside UserProfileUpdateView")
    # queryset = User.objects.all()
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        print(f"Authorization header: {self.request.headers.get('Authorization')}")
        print(f"Authenticated user: {self.request.user}")
        return self.request.user

class UploadProfileImageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        profile_image_url = request.data.get("profile_image")  # Get the image URL from the request

        if not profile_image_url:
            return Response({"error": "No image URL provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Pass the exact URL to the serializer
            serializer = UserProfileUpdateSerializer(user, data={"profile_image": profile_image_url}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
