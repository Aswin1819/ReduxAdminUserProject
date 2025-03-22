from rest_framework import serializers
from accounts.models import CustomUser  # Import the CustomUser model

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()  # Use a method to get the URL

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile_image']

    def get_profile_image(self, obj):
        # Explicitly return the URL of the profile_image field
        return obj.profile_image.url if obj.profile_image else None

    def update(self, instance, validated_data):
        # Update the profile_image field
        profile_image_url = validated_data.get('profile_image', None)
        if profile_image_url:
            instance.profile_image = profile_image_url
        instance.save()
        return instance
