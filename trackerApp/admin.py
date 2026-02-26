from django.contrib import admin
from .models import Developer, ProjectApplication

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_info')
    search_fields = ('name',)

@admin.register(ProjectApplication)
class ProjectApplicationAdmin(admin.ModelAdmin):
    # 1. THE LIST VIEW
    list_display = ('name_of_proj', 'cr_no', 'ls_no', 'status_of_application', 'type_of_application', 'date_filed')
    list_editable = ('status_of_application',)

    # 2. FILTERS & SEARCH
    list_filter = ('status_of_application', 'type_of_application', 'main_or_compliance', 'prov')
    search_fields = ('name_of_proj', 'cr_no', 'ls_no', 'proj_owner_dev')

    # 3. FORM LAYOUT
    fieldsets = (
        ('Project Core Details', {
            'fields': ('name_of_proj', 'proj_owner_dev', 'proj_type')
        }),
        ('Location', {
            'fields': ('prov', 'mun_city', 'street_brgy')
        }),
        ('Application Status & Type', {
            'fields': ('type_of_application', 'status_of_application', 'main_or_compliance', 'crls_options')
        }),
        ('Certificates & Dates', {
            'fields': ('cr_no', 'ls_no', 'date_filed', 'date_issued', 'date_completion')
        }),
    )