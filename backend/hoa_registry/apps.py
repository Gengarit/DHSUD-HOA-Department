from django.apps import AppConfig


class HoaRegistryConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'hoa_registry'
    
    def ready(self):
        import hoa_registry.models  # Import signals