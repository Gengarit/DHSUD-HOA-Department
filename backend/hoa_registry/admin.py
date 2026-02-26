
from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import HOAProfile, NOV, OTP, OIAS, Sanction, EventSchedule

# DHSUD-aligned import-export resources
class HOAProfileResource(resources.ModelResource):
    class Meta:
        model = HOAProfile
        import_id_fields = ['hoa_name']
        fields = (
            'no', 'docket_no', 'hoa_name', 'registration_type', 'date_of_issuance',
            'cert_of_incorp_no', 'date_of_incorp', 'cert_reference_no',
            'classification', 'barangay', 'city_municipality', 'province',
            'total_members', 'male_members', 'female_members',
            'date_of_election', 'term_of_office', 'total_bods', 'male_bods', 'female_bods',
            'updated_list_of_members', 'date_of_last_submission', 'gis', 'financial_records', 'election_reports',
            'status', 'violation_section_64', 'violation_section_101', 'violation_section_62',
            'president_name', 'email_address', 'remarks',
        )

class NOVResource(resources.ModelResource):
    class Meta:
        model = NOV
        import_id_fields = ['control_no']
        fields = (
            'control_no', 'hoa_profile', 'violation_section_64', 'violation_section_101', 'violation_section_62', 'date_issued', 'evaluator_name',
        )

class OTPResource(resources.ModelResource):
    class Meta:
        model = OTP
        import_id_fields = ['control_no']
        fields = (
            'control_no', 'hoa_profile', 'nov_control_no', 'submission_comment', 'date', 'evaluator', 'mr_status',
        )

class OIASResource(resources.ModelResource):
    class Meta:
        model = OIAS
        import_id_fields = ['control_no']
        fields = (
            'control_no', 'hoa_profile', 'nov_control_no', 'penalties', 'date', 'evaluator', 'mr_status',
        )


@admin.register(HOAProfile)
class HOAProfileAdmin(ImportExportModelAdmin):
    resource_class = HOAProfileResource
    list_display = ('hoa_name', 'status', 'city_municipality', 'date_created')
    list_filter = ('status', 'province', 'is_archived')
    search_fields = ('hoa_name', 'city_municipality')
    list_editable = ('status',)
    readonly_fields = ('date_created', 'date_of_last_update')


@admin.register(NOV)
class NOVAdmin(ImportExportModelAdmin):
    resource_class = NOVResource
    list_display = ('control_no', 'hoa_profile', 'date_issued', 'evaluator_name')
    list_filter = ('violation_section_64', 'violation_section_101', 'violation_section_62', 'is_archived')
    search_fields = ('control_no', 'hoa_profile__hoa_name', 'evaluator_name')
    readonly_fields = ('date_created', 'control_no')


@admin.register(OTP)
class OTPAdmin(ImportExportModelAdmin):
    resource_class = OTPResource
    list_display = ('control_no', 'hoa_profile', 'mr_status', 'date')
    list_filter = ('mr_status', 'is_archived')
    search_fields = ('control_no', 'hoa_profile__hoa_name')
    readonly_fields = ('date_created',)


@admin.register(OIAS)
class OIASAdmin(ImportExportModelAdmin):
    resource_class = OIASResource
    list_display = ('control_no', 'hoa_profile', 'mr_status', 'date')
    list_filter = ('mr_status', 'is_archived')
    search_fields = ('control_no', 'hoa_profile__hoa_name')
    readonly_fields = ('date_created',)


@admin.register(Sanction)
class SanctionAdmin(admin.ModelAdmin):
    list_display = ('hoa_profile', 'severity_level', 'date_imposed')
    list_filter = ('severity_level', 'is_archived')
    search_fields = ('hoa_profile__hoa_name',)
    readonly_fields = ('date_created',)


@admin.register(EventSchedule)
class EventScheduleAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'start_date')
    list_filter = ('event_type', 'is_archived')
    search_fields = ('title', 'description')
    readonly_fields = ('date_created',)
