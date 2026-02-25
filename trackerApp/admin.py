from django.contrib import admin
from .models import Developer, CRLSOption, ProjectApplication

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_info')
    search_fields = ('name',)

@admin.register(CRLSOption)
class CRLSOptionAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(ProjectApplication)
class ProjectApplicationAdmin(admin.ModelAdmin):
    # 1. THE LIST VIEW: What the encoder sees when they open the table
    list_display = ('name_of_proj', 'cr_no', 'ls_no', 'status_of_application', 'type_of_application', 'date_filed')
    
    # Let the encoder change the status instantly without opening the full record
    list_editable = ('status_of_application',)

    # 2. FILTERS & SEARCH: How the encoder finds old records
    list_filter = ('status_of_application', 'type_of_application', 'main_or_compliance', 'prov')
    search_fields = ('name_of_proj', 'cr_no', 'ls_no', 'proj_owner_dev__name')

    # 3. THE "CHOOSE MANY" FIX: This turns a standard multi-select into a clean dual-box interface
    filter_horizontal = ('new_or_amended_crls',)

    # 4. FORM LAYOUT: Groups fields into clean, logical sections for faster typing
    fieldsets = (
        ('Project Core Details', {
            'fields': ('name_of_proj', 'proj_owner_dev', 'proj_type')
        }),
        ('Location', {
            'fields': ('prov', 'mun_city', 'street_brgy')
        }),
        ('Application Status & Type', {
            'fields': ('type_of_application', 'status_of_application', 'main_or_compliance', 'new_or_amended_crls')
        }),
        ('Certificates & Dates', {
            'fields': ('cr_no', 'ls_no', 'date_filed', 'date_issued', 'date_completion')
        }),
    )