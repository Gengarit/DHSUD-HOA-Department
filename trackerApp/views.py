from rest_framework import viewsets
from .models import ProjectApplication
from .serializers import ProjectApplicationSerializer

class ProjectApplicationViewSet(viewsets.ModelViewSet):
    queryset = ProjectApplication.objects.all()
    serializer_class = ProjectApplicationSerializer