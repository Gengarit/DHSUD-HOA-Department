from rest_framework import serializers
from .models import ProjectApplication

class ProjectApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectApplication
        fields = '__all__' # This grabs every field for the frontend