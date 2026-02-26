from rest_framework import serializers
from .models import HOAProfile, NOV, OTP, OIAS, Sanction, EventSchedule


class HOAProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HOAProfile
        fields = [
            'id', 'no', 'docket_no', 'hoa_name', 'registration_type', 'date_of_issuance',
            'cert_of_incorp_no', 'date_of_incorp', 'cert_reference_no',
            'classification', 'barangay', 'city_municipality', 'province',
            'total_members', 'male_members', 'female_members',
            'date_of_election', 'term_of_office', 'total_bods', 'male_bods', 'female_bods',
            'updated_list_of_members', 'date_of_last_submission', 'gis', 'financial_records', 'election_reports',
            'status', 'violation_section_64', 'violation_section_101', 'violation_section_62',
            'president_name', 'email_address', 'remarks',
            'date_of_last_update', 'date_created', 'is_archived'
        ]
        read_only_fields = ['date_created', 'date_of_last_update']


class NOVSerializer(serializers.ModelSerializer):
    class Meta:
        model = NOV
        fields = '__all__'
        read_only_fields = ['date_created', 'control_no']


class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = '__all__'
        read_only_fields = ['date_created']


class OIASSerializer(serializers.ModelSerializer):
    class Meta:
        model = OIAS
        fields = '__all__'
        read_only_fields = ['date_created']


class SanctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sanction
        fields = '__all__'
        read_only_fields = ['date_created']


class EventScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventSchedule
        fields = '__all__'
        read_only_fields = ['date_created']
