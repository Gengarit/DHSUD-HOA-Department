from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.http import HttpResponse
import csv
from .models import HOAProfile, NOV, OTP, OIAS, Sanction, EventSchedule
from .serializers import (
    HOAProfileSerializer, NOVSerializer, OTPSerializer, 
    OIASSerializer, SanctionSerializer, EventScheduleSerializer
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 1000


class HOAProfileViewSet(viewsets.ModelViewSet):
    queryset = HOAProfile.objects.filter(is_archived=False)
    serializer_class = HOAProfileSerializer
    pagination_class = StandardResultsSetPagination
    search_fields = ['hoa_name', 'city_municipality', 'province']
    ordering_fields = ['hoa_name', 'status', 'date_created']
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        """Get archived HOA profiles"""
        archived = HOAProfile.objects.filter(is_archived=True)
        page = self.paginate_queryset(archived)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(archived, many=True)
        return Response(serializer.data)
    
    @action(detail=0, methods=['post'])
    def soft_delete(self, request, pk=None):
        """Soft delete HOA profile"""
        hoa = self.get_object()
        hoa.is_archived = True
        hoa.save()
        return Response({'status': 'HOA archived'})
    
    @action(detail=False, methods=['post'])
    def restore(self, request, pk=None):
        """Restore archived HOA profile"""
        hoa_id = request.data.get('id')
        hoa = HOAProfile.objects.get(id=hoa_id)
        hoa.is_archived = False
        hoa.save()
        return Response({'status': 'HOA restored'})
    
    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export HOA profiles to CSV with DHSUD-aligned headers"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="hoa_profiles_dhsud.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'NO', 'DOCKET NO.', 'NAME OF HOMEOWNERS ASSOCIATION', 'REGISTRATION (SEC/HIGC/HLURB/DHSUD)',
            'DATE OF ISSUANCE (mm/dd/yy)', 'CERTIFICATE OF INCORPORATION. NO', 'DATE OF INCORPORATION (HLURB/DHSUD) (mm/dd/yy)', 'CERTIFICATE/REFERENCE NO.',
            'CLASSIFICATION (REGULAR, NON-REGULAR, GOVT ASSISTED, NEIGHBORHOOD, FEDERATION, CONFEDERATION)',
            'BARANGAY', 'CITY/MUNICIPALITY', 'PROVINCES',
            'TOTAL MEMBERS', 'MALE MEMBERS', 'FEMALE MEMBERS',
            'DATE OF ELECTION', 'TERM OF OFFICE', 'TOTAL BODs', 'MALE BODs', 'FEMALE BODs',
            'UPDATED LIST OF MEMBERS (✓ / X)', 'DATE OF LAST SUBMISSION (mm/dd/yy)', 'GIS (✓ / X)', 'FINANCIAL RECORDS (✓, X , N/A)', 'ELECTION REPORTS (✓, X , N/A)',
            'DHSUD STATUS', 'Section 64', 'Section 101', 'Section 62',
            'NAME OF PRESIDENT', 'EMAIL ADDRESS', 'REMARKS'
        ])

        hoas = HOAProfile.objects.filter(is_archived=False)
        for hoa in hoas:
            writer.writerow([
                hoa.no,
                hoa.docket_no,
                hoa.hoa_name,
                hoa.registration_type,
                hoa.date_of_issuance.strftime('%m/%d/%y') if hoa.date_of_issuance else '',
                hoa.cert_of_incorp_no,
                hoa.date_of_incorp.strftime('%m/%d/%y') if hoa.date_of_incorp else '',
                hoa.cert_reference_no,
                hoa.classification,
                hoa.barangay,
                hoa.city_municipality,
                hoa.province,
                hoa.total_members,
                hoa.male_members,
                hoa.female_members,
                hoa.date_of_election.strftime('%m/%d/%y') if hoa.date_of_election else '',
                hoa.term_of_office,
                hoa.total_bods,
                hoa.male_bods,
                hoa.female_bods,
                hoa.updated_list_of_members,
                hoa.date_of_last_submission.strftime('%m/%d/%y') if hoa.date_of_last_submission else '',
                hoa.gis,
                hoa.financial_records,
                hoa.election_reports,
                hoa.status,
                '✓' if hoa.violation_section_64 else '',
                '✓' if hoa.violation_section_101 else '',
                '✓' if hoa.violation_section_62 else '',
                hoa.president_name,
                hoa.email_address,
                hoa.remarks,
            ])
        return response
    
    @action(detail=False, methods=['post'])
    def import_csv(self, request):
        """Import HOA profiles from CSV"""
        try:
            file = request.FILES['file']
            decoded_file = file.read().decode('utf-8').splitlines()
            reader = csv.DictReader(decoded_file)
            
            created_count = 0
            errors = []
            
            for row in reader:
                try:
                    hoa, created = HOAProfile.objects.get_or_create(
                        hoa_name=row['HOA Name'],
                        defaults={
                            'cert_of_inc_no': row.get('Cert of Inc No', ''),
                            'reg_type': row.get('Reg Type', ''),
                            'issuance_date': row.get('Issuance Date', '2024-01-01'),
                            'classification': row.get('Classification', ''),
                            'barangay': row.get('Barangay', ''),
                            'city_municipality': row.get('City/Municipality', ''),
                            'province': row.get('Province', ''),
                            'contact_person': row.get('Contact Person', ''),
                            'contact_details': row.get('Contact Details', ''),
                            'total_members': int(row.get('Total Members', 0)),
                            'date_of_election': row.get('Date of Election', '2024-01-01'),
                            'term_of_office': row.get('Term of Office', ''),
                            'evaluator_name': row.get('Evaluator Name', ''),
                            'status': row.get('Status', 'pending'),
                        }
                    )
                    if created:
                        created_count += 1
                except Exception as e:
                    errors.append(f"Error creating {row.get('HOA Name')}: {str(e)}")
            
            return Response({
                'created': created_count,
                'errors': errors
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class NOVViewSet(viewsets.ModelViewSet):
    queryset = NOV.objects.filter(is_archived=False)
    serializer_class = NOVSerializer
    pagination_class = StandardResultsSetPagination
    search_fields = ['control_no', 'hoa_profile__hoa_name']
    ordering_fields = ['date_issued', 'control_no']
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        archived = NOV.objects.filter(is_archived=True)
        page = self.paginate_queryset(archived)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(archived, many=True)
        return Response(serializer.data)


class OTPViewSet(viewsets.ModelViewSet):
    queryset = OTP.objects.filter(is_archived=False)
    serializer_class = OTPSerializer
    pagination_class = StandardResultsSetPagination
    search_fields = ['control_no', 'hoa_profile__hoa_name']
    ordering_fields = ['date', 'control_no']
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        archived = OTP.objects.filter(is_archived=True)
        page = self.paginate_queryset(archived)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(archived, many=True)
        return Response(serializer.data)


class OIASViewSet(viewsets.ModelViewSet):
    queryset = OIAS.objects.filter(is_archived=False)
    serializer_class = OIASSerializer
    pagination_class = StandardResultsSetPagination
    search_fields = ['control_no', 'hoa_profile__hoa_name']
    ordering_fields = ['date', 'control_no']
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        archived = OIAS.objects.filter(is_archived=True)
        page = self.paginate_queryset(archived)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(archived, many=True)
        return Response(serializer.data)


class SanctionViewSet(viewsets.ModelViewSet):
    queryset = Sanction.objects.filter(is_archived=False)
    serializer_class = SanctionSerializer
    pagination_class = StandardResultsSetPagination
    search_fields = ['hoa_profile__hoa_name', 'severity_level']
    ordering_fields = ['date_imposed', 'severity_level']
    
    @action(detail=False, methods=['get'])
    def archived(self, request):
        archived = Sanction.objects.filter(is_archived=True)
        page = self.paginate_queryset(archived)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(archived, many=True)
        return Response(serializer.data)
