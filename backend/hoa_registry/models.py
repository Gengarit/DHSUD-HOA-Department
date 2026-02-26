from django.db import models
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from datetime import datetime


# DHSUD-aligned HOA Registry Model
class HOAProfile(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Suspended', 'Suspended'),
        ('No legal standing', 'No legal standing'),
        ('Dissolved', 'Dissolved'),
        ('Revoked', 'Revoked'),
        ('Term expired', 'Term expired'),
        ('Pending', 'Pending'),
    ]

    # Identity & Registration
    no = models.CharField(max_length=20, blank=True, null=True, verbose_name='NO')
    docket_no = models.CharField(max_length=50, blank=True, null=True, verbose_name='DOCKET NO.')
    hoa_name = models.CharField(max_length=255, unique=True, verbose_name='NAME OF HOMEOWNERS ASSOCIATION')
    registration_type = models.CharField(max_length=50, blank=True, null=True, verbose_name='REGISTRATION (SEC/HIGC/HLURB/DHSUD)')
    date_of_issuance = models.DateField(blank=True, null=True, verbose_name='DATE OF ISSUANCE (mm/dd/yy)')
    cert_of_incorp_no = models.CharField(max_length=100, unique=True, blank=True, null=True, verbose_name='CERTIFICATE OF INCORPORATION. NO')
    date_of_incorp = models.DateField(blank=True, null=True, verbose_name='DATE OF INCORPORATION (HLURB/DHSUD) (mm/dd/yy)')
    cert_reference_no = models.CharField(max_length=100, blank=True, null=True, verbose_name='CERTIFICATE/REFERENCE NO.')

    # Classification
    classification = models.CharField(max_length=100, blank=True, null=True, verbose_name='CLASSIFICATION (REGULAR, NON-REGULAR, GOVT ASSISTED, NEIGHBORHOOD, FEDERATION, CONFEDERATION)')

    # Location
    barangay = models.CharField(max_length=100, blank=True, null=True, verbose_name='BARANGAY')
    city_municipality = models.CharField(max_length=100, blank=True, null=True, verbose_name='CITY/MUNICIPALITY')
    province = models.CharField(max_length=100, blank=True, null=True, verbose_name='PROVINCES')

    # Membership
    total_members = models.IntegerField(blank=True, null=True, verbose_name='TOTAL MEMBERS')
    male_members = models.IntegerField(blank=True, null=True, verbose_name='MALE MEMBERS')
    female_members = models.IntegerField(blank=True, null=True, verbose_name='FEMALE MEMBERS')

    # Governance
    date_of_election = models.DateField(blank=True, null=True, verbose_name='DATE OF ELECTION')
    term_of_office = models.CharField(max_length=100, blank=True, null=True, verbose_name='TERM OF OFFICE')
    total_bods = models.IntegerField(blank=True, null=True, verbose_name='TOTAL BODs')
    male_bods = models.IntegerField(blank=True, null=True, verbose_name='MALE BODs')
    female_bods = models.IntegerField(blank=True, null=True, verbose_name='FEMALE BODs')

    # Post-Reg Compliance
    updated_list_of_members = models.CharField(max_length=2, choices=[('✓', '✓'), ('X', 'X')], blank=True, null=True, verbose_name='UPDATED LIST OF MEMBERS (✓ / X)')
    date_of_last_submission = models.DateField(blank=True, null=True, verbose_name='DATE OF LAST SUBMISSION (mm/dd/yy)')
    gis = models.CharField(max_length=2, choices=[('✓', '✓'), ('X', 'X')], blank=True, null=True, verbose_name='GIS (✓ / X)')
    financial_records = models.CharField(max_length=3, choices=[('✓', '✓'), ('X', 'X'), ('N/A', 'N/A')], blank=True, null=True, verbose_name='FINANCIAL RECORDS (✓, X , N/A)')
    election_reports = models.CharField(max_length=3, choices=[('✓', '✓'), ('X', 'X'), ('N/A', 'N/A')], blank=True, null=True, verbose_name='ELECTION REPORTS (✓, X , N/A)')

    # DHSUD Status
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending', verbose_name='DHSUD STATUS')

    # Violations
    violation_section_64 = models.BooleanField(default=False, verbose_name='Section 64')
    violation_section_101 = models.BooleanField(default=False, verbose_name='Section 101')
    violation_section_62 = models.BooleanField(default=False, verbose_name='Section 62')

    # Contact Info
    president_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='NAME OF PRESIDENT')
    email_address = models.EmailField(blank=True, null=True, verbose_name='EMAIL ADDRESS')
    remarks = models.TextField(blank=True, null=True, verbose_name='REMARKS')

    # System Fields
    date_of_last_update = models.DateTimeField(auto_now=True)
    date_created = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return self.hoa_name


class NOV(models.Model):
    hoa_profile = models.ForeignKey(HOAProfile, on_delete=models.CASCADE, related_name='novs')
    control_no = models.CharField(max_length=100, unique=True, verbose_name='Control #')
    violation_section_64 = models.BooleanField(default=False, verbose_name='Section 64')
    violation_section_101 = models.BooleanField(default=False, verbose_name='Section 101')
    violation_section_62 = models.BooleanField(default=False, verbose_name='Section 62')
    date_issued = models.DateField(blank=True, null=True, verbose_name='Date Issued')
    evaluator_name = models.CharField(max_length=255, blank=True, null=True, verbose_name='Evaluator')
    date_created = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self):
        return f"NOV {self.control_no} - {self.hoa_profile.hoa_name}"


class OTP(models.Model):
    MR_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
    ]
    
    hoa_profile = models.ForeignKey(HOAProfile, on_delete=models.CASCADE, related_name='otps')
    control_no = models.CharField(max_length=100, unique=True, verbose_name='Control #')
    nov_control_no = models.ForeignKey(NOV, on_delete=models.CASCADE, related_name='otps', verbose_name='NOV Control #')
    submission_comment = models.TextField(verbose_name='Comment')
    date = models.DateField(verbose_name='Date')
    evaluator = models.CharField(max_length=255, verbose_name='Evaluator')
    mr_status = models.CharField(max_length=50, choices=MR_STATUS_CHOICES, default='pending', verbose_name='MR Status')
    date_created = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self):
        return f"OTP {self.control_no} - {self.hoa_profile.hoa_name}"


class OIAS(models.Model):
    MR_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('denied', 'Denied'),
    ]
    
    hoa_profile = models.ForeignKey(HOAProfile, on_delete=models.CASCADE, related_name='oias_records')
    control_no = models.CharField(max_length=100, unique=True, verbose_name='Control #')
    nov_control_no = models.ForeignKey(NOV, on_delete=models.CASCADE, related_name='oias_records', verbose_name='NOV Control #')
    penalties = models.TextField(verbose_name='Penalties')
    date = models.DateField(verbose_name='Date')
    evaluator = models.CharField(max_length=255, verbose_name='Evaluator')
    mr_status = models.CharField(max_length=50, choices=MR_STATUS_CHOICES, default='pending', verbose_name='MR Status')
    date_created = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self):
        return f"OIAS {self.control_no} - {self.hoa_profile.hoa_name}"


class Sanction(models.Model):
    PENALTY_SCALE = [
        ('1', 'Censure'),
        ('2', 'Fine'),
        ('3', 'Suspension of Privileges'),
        ('4', 'Suspension of Board'),
        ('5', 'Removal of Officers'),
        ('6', 'Revocation'),
    ]
    
    hoa_profile = models.ForeignKey(HOAProfile, on_delete=models.CASCADE, related_name='sanctions')
    severity_level = models.CharField(max_length=2, choices=PENALTY_SCALE)
    description = models.TextField()
    date_imposed = models.DateField()
    effective_date = models.DateField()
    evaluator = models.CharField(max_length=255)
    oias_reference = models.ForeignKey(OIAS, on_delete=models.SET_NULL, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-date_created']
    
    def __str__(self):
        return f"{self.get_severity_level_display()} - {self.hoa_profile.hoa_name}"


class EventSchedule(models.Model):
    EVENT_TYPES = [
        ('board_appointment', 'Interim Board Appointments'),
        ('orientation', 'HOA Orientations'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    hoa_profile = models.ForeignKey(HOAProfile, on_delete=models.SET_NULL, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    is_archived = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-start_date']
    
    def __str__(self):
        return self.title


# Signal to auto-generate NOV when HOAProfile has violations
@receiver(post_save, sender=HOAProfile)
def create_nov_for_violations(sender, instance, created, **kwargs):
    """Auto-generate NOV control number and record when HOA has violations"""
    has_violations = instance.violation_section_64 or instance.violation_section_101 or instance.violation_section_62
    
    if has_violations:
        # Try to get existing NOV for this HOA
        nov, nov_created = NOV.objects.get_or_create(hoa_profile=instance)
        
        # If creating new NOV, generate control number
        if nov_created:
            year = instance.date_created.year
            count = NOV.objects.filter(date_created__year=year).count()
            control_no = f"NOV-{year}-{count:03d}"
            nov.control_no = control_no
        
        # Update violation flags and evaluator/date from HOAProfile
        nov.violation_section_64 = instance.violation_section_64
        nov.violation_section_101 = instance.violation_section_101
        nov.violation_section_62 = instance.violation_section_62
        nov.date_issued = instance.date_of_last_update.date() if instance.date_of_last_update else timezone.now().date()
        nov.evaluator_name = instance.evaluator_name
        nov.save()
    else:
        # If no violations anymore, archive existing NOV
        try:
            nov = NOV.objects.get(hoa_profile=instance)
            nov.is_archived = True
            nov.save()
        except NOV.DoesNotExist:
            pass